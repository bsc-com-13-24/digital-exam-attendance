import { Injectable, NotFoundException, UnauthorizedException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { resolve4, resolveMx } from 'dns/promises';
import { randomBytes } from 'crypto';
import { User } from './entities/users.entity';
import { UserRole } from './entities/user-roles.entity';
import { Role } from './entities/roles.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) { }

  async onModuleInit() {
    await this.seedRoles();
  }

  private async seedRoles() {
    const rolesToSeed = [
      { name: 'admin', display_name: 'Administrator' },
      { name: 'teacher', display_name: 'Teacher' },
      { name: 'invigilator', display_name: 'Invigilator' },
    ];

    for (const roleData of rolesToSeed) {
      const existingRole = await this.roleRepository.findOne({ where: { name: roleData.name } });
      if (!existingRole) {
        const role = this.roleRepository.create(roleData);
        await this.roleRepository.save(role);
        console.log(`Role seeded: ${roleData.name}`);
      }
    }
  }

  async createUser(dto: CreateUserDto): Promise<{ message: string; userId: string; access_token: string; verification_token: string; verification_link: string }> {
    await this.verifyEmailDomain(dto.email);

    const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    const password_hash = await bcrypt.hash(dto.password, 10);

    const verificationToken = this.generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = this.userRepository.create({
      first_name: dto.first_name,
      last_name: dto.last_name,
      email: dto.email,
      password_hash,
      email_verified: true, // Verified by default now
      verification_token: verificationToken,
      verification_token_expiry: verificationTokenExpiry,
    });

    const savedUser = await this.userRepository.save(user);

    const roles: string[] = [];
    if (dto.role) {
      const roleName = dto.role.toLowerCase();
      const role = await this.roleRepository.findOne({ where: { name: roleName } });
      
      if (role) {
        const userRole = this.userRoleRepository.create({
          user_id: savedUser.id,
          role_id: role.id,
        });
        await this.userRoleRepository.save(userRole);
        roles.push(roleName);
      }
    }

    const access_token = this.generateAccessToken(savedUser, roles);

    return {
      message: `User registered successfully. A verification email has been sent to ${savedUser.email}. Please verify your email to access the system.`,
      userId: savedUser.id,
      access_token,
      verification_token: verificationToken,
      verification_link: `http://localhost:3000/api/v1/auth/verify-email?token=${verificationToken}`,
    };
  }

  private generateAccessToken(user: User, roles: string[]): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      fullName: `${user.first_name} ${user.last_name}`,
      roles: roles,
    });
  }

  private generateVerificationToken(): string {
    return randomBytes(32).toString('hex');
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { verification_token: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (user.verification_token_expiry && user.verification_token_expiry < new Date()) {
      throw new BadRequestException('Verification token has expired. Please request a new verification email.');
    }

    user.email_verified = true;
    user.verification_token = null;
    user.verification_token_expiry = null;

    await this.userRepository.save(user);

    return { message: 'Email verified successfully! You can now login to the system.' };
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    if (user.email_verified) {
      throw new BadRequestException('Email is already verified');
    }

    const verificationToken = this.generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verification_token = verificationToken;
    user.verification_token_expiry = verificationTokenExpiry;

    await this.userRepository.save(user);

    await this.sendVerificationEmail(user.email, verificationToken);

    return { message: `A new verification email has been sent to ${email}` };
  }

  private async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationLink = `http://localhost:3000/api/v1/auth/verify-email?token=${token}`;
    console.log(`[MOCK EMAIL] Verification Link: ${verificationLink}`);
  }

  private async verifyEmailDomain(email: string): Promise<void> {
    if (process.env.SKIP_EMAIL_VERIFY === 'true') {
      return;
    }

    const domain = email.split('@')[1];
    if (!domain) {
      throw new BadRequestException('Email is not valid');
    }

    const devDomains = ['localhost', 'example.com', 'test.com'];
    if (devDomains.includes(domain.toLowerCase())) {
      return;
    }

    try {
      const mxRecords = await resolveMx(domain);
      if (mxRecords && mxRecords.length > 0) {
        return;
      }
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEOUT' || error.code === 'ENOTFOUND') {
        return;
      }
    }


    try {
      const aRecords = await resolve4(domain);
      if (aRecords && aRecords.length > 0) {
        return;
      }
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEOUT' || error.code === 'ENOTFOUND') {
        return;
      }
    }

    throw new BadRequestException('Email domain is not valid or cannot be verified');
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }

  async getUserWithRoles(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.role'],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.getUserById(id);
    await this.userRepository.update(id, updateUserDto);
    return await this.getUserById(id);
  }

  async deleteProfile(id: string): Promise<{ message: string }> {
    await this.getUserById(id);
    await this.userRepository.delete(id);
    return { message: `User with ID ${id} deleted successfully` };
  }

  async login(email: string, password: string) {
    const user = await this.getUserByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new UnauthorizedException('Wrong credentials');

    const userWithRoles = await this.getUserWithRoles(user.id);
    const roles = userWithRoles.roles.map((ur) => ur.role.name);

    return {
      access_token: this.generateAccessToken(user, roles),
    };
  }
}
