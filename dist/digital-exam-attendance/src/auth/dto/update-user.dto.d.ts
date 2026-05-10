import { CreateUserDto } from './create-user.dto';
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    role?: string;
}
export {};
