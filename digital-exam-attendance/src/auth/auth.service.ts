<<<<<<< HEAD
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  // CREATE 
  async createUser(dto: CreateUserDto): Promise<User> {
    // Hashing the password before saving
    const password_hash = await bcrypt.hash(dto.password, 10);

    // Create the entity and map password → password_hash
    const user = this.userRepository.create({
      first_name: dto.first_name,
      last_name: dto.last_name,
      email: dto.email,
      password_hash,           
    });

    return await this.userRepository.save(user); 
  }

  // READ 
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

  //UPDATE  
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.getUserById(id);
    await this.userRepository.update(id, updateUserDto);
    return await this.getUserById(id);
  }

  //DELETE 
  async deleteProfile(id: string): Promise<{ message: string }> {
    await this.getUserById(id);
    await this.userRepository.delete(id);
    return { message: `User with ID ${id} deleted successfully` };
  }

  // LOGIN 
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
=======
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {}
>>>>>>> 1f4981e (Configured dtos and service for Offline module.)
