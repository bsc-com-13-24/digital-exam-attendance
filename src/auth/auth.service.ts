import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
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
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<{ message: string; userId: string }> {
    await this.verifyEmailDomain(dto.email);

    const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    // hash password
    const password_hash = await bcrypt.hash(dto.password, 10);

    // Generate verification token
    const verificationToken = this.generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // map fields
    const user = this.userRepository.create({
      first_name: dto.first_name,
      last_name: dto.last_name,
      email: dto.email,
      password_hash,
      email_verified: false,
      verification_token: verificationToken,
      verification_token_expiry: verificationTokenExpiry,
    });

    const savedUser = await this.userRepository.save(user);

    // set role
    if (dto.role) {
      const role = await this.roleRepository.findOne({ where: { name: dto.role.toLowerCase() } });
      if (role) {
        const userRole = this.userRoleRepository.create({
          user_id: savedUser.id,
          role_id: role.id,
        });
        await this.userRoleRepository.save(userRole);
      }
    }

    // Send verification email
    await this.sendVerificationEmail(savedUser.email, verificationToken);

    return {
      message: `User registered successfully. A verification email has been sent to ${savedUser.email}. Please verify your email to access the system.`,
      userId: savedUser.id,
    };
  }

  /**
   * Generate a random verification token
   */
  private generateVerificationToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Verify user email with token
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { verification_token: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    // Check if token has expired
    if (user.verification_token_expiry && user.verification_token_expiry < new Date()) {
      throw new BadRequestException('Verification token has expired. Please request a new verification email.');
    }

    // Mark email as verified
    user.email_verified = true;
    user.verification_token = null;
    user.verification_token_expiry = null;

    await this.userRepository.save(user);

    return { message: 'Email verified successfully! You can now login to the system.' };
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    if (user.email_verified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate new verification token
    const verificationToken = this.generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.verification_token = verificationToken;
    user.verification_token_expiry = verificationTokenExpiry;

    await this.userRepository.save(user);

    // Send verification email
    await this.sendVerificationEmail(user.email, verificationToken);

    return { message: `A new verification email has been sent to ${email}` };
  }

  /**
   * Send verification email (can be configured with nodemailer)
   */
  private async sendVerificationEmail(email: string, token: string): Promise<void> {
    // TODO: Integrate with nodemailer or other email service
    // For now, log the verification link to console
    const verificationLink = `http://localhost:3000/api/v1/auth/verify-email?token=${token}`;
    console.log(`
      ========================================
      EMAIL VERIFICATION
      ========================================
      To: ${email}
      Verification Link: ${verificationLink}
      Token: ${token}
      Valid for: 24 hours
      ========================================
    `);

    // In production, replace this with actual email sending:
    // const transporter = nodemailer.createTransport({...});
    // await transporter.sendMail({
    //   to: email,
    //   subject: 'Verify Your Email',
    //   html: `<a href="${verificationLink}">Click here to verify your email</a>`
    // });
  }

  private async verifyEmailDomain(email: string): Promise<void> {
    const domain = email.split('@')[1];
    if (!domain) {
      throw new BadRequestException('Email is not valid');
    }

    try {
      const mxRecords = await resolveMx(domain);
      if (mxRecords && mxRecords.length > 0) {
        return;
      }
    } catch {
      // ignore and try fallback
    }

    try {
      const aRecords = await resolve4(domain);
      if (aRecords && aRecords.length > 0) {
        return;
      }
    } catch {
      // ignore fallback failure
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
    if (!user) throw new UnauthorizedException('Wrong credentials');

    // Check if email is verified
    if (!user.email_verified) {
      throw new UnauthorizedException(
        'Email is not verified. Please check your email for the verification link or request a new one.',
      );
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new UnauthorizedException('Wrong credentials');

    return {
      access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }
}
