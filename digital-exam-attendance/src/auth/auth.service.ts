import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity'
import { UserRole } from './entities/user-roles.entity';
import { Role } from './entities/roles.entity';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AssignRoleDto } from './dto/assign-role.dto';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>,

        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ) { }

    //USER CREATION CRUD
    async createUser(dto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(dto);
        return await this.userRepository.save(dto);
    }

    async getUserById(id: string): Promise<User> {
        const session = await this.userRepository.findOne({
            where: { id }
        });
        if (!session) {
            throw new NotFoundException(`Session with ID ${id} not found`);
        }
        return session;
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        await this.getUserById(id);
        await this.userRepository.update(id, updateUserDto);
        return await this.getUserById(id);
    }

    async deleteProfile(id: string): Promise<{ message: string }> {
        await this.getUserById(id);
        await this.userRepository.delete(id);
        return { message: `User with  ${id} deleted successfully` };
    }

    //SECURE LOGIN USING THE CREDENTIALS CREATED ABOVE
    

}
