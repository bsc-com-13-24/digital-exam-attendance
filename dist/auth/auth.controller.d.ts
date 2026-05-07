import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: CreateUserDto): Promise<import("./entities/users.entity").User>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
    getProfile(req: any): Promise<import("./entities/users.entity").User>;
    getUserById(id: string): Promise<import("./entities/users.entity").User>;
    updateUser(id: string, dto: UpdateUserDto, req: any): Promise<import("./entities/users.entity").User>;
    deleteUser(id: string, req: any): Promise<{
        message: string;
    }>;
}
