import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { UserRole } from './entities/user-roles.entity';
import { Role } from './entities/roles.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly userRepository;
    private readonly userRoleRepository;
    private readonly roleRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, userRoleRepository: Repository<UserRole>, roleRepository: Repository<Role>, jwtService: JwtService);
    createUser(dto: CreateUserDto): Promise<{
        message: string;
        userId: string;
    }>;
    private generateVerificationToken;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
    private sendVerificationEmail;
    private verifyEmailDomain;
    getUserById(id: string): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    getUserWithRoles(id: string): Promise<User>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    deleteProfile(id: string): Promise<{
        message: string;
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
    }>;
}
