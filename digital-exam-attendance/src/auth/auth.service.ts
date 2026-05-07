import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { resolve4, resolveMx } from 'dns/promises';
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
  ) { }

  async createUser(dto: CreateUserDto): Promise<User> {
    await this.verifyEmailDomain(dto.email);

    const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    // hash password
    const password_hash = await bcrypt.hash(dto.password, 10);

    // map fields
    const user = this.userRepository.create({
      first_name: dto.first_name,
      last_name: dto.last_name,
      email: dto.email,
      password_hash,
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

    return this.getUserWithRoles(savedUser.id);
  }

  private async verifyEmailDomain(email: string): Promise<void> {
    if (process.env.SKIP_EMAIL_VERIFY === 'true') {
      return;
    }

    const domain = email.split('@')[1];
    if (!domain) {
      throw new BadRequestException('Email is not valid');
    }

    // Allow localhost and common dev domains without DNS check
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
        // If DNS query fails due to network or server issues, we skip verification
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
    if (!user) throw new UnauthorizedException('Wrong credentials');

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new UnauthorizedException('Wrong credentials');

    return {
      access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }
}
