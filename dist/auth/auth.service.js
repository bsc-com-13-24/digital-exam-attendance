"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const promises_1 = require("dns/promises");
const users_entity_1 = require("./entities/users.entity");
const user_roles_entity_1 = require("./entities/user-roles.entity");
const roles_entity_1 = require("./entities/roles.entity");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    userRepository;
    userRoleRepository;
    roleRepository;
    jwtService;
    constructor(userRepository, userRoleRepository, roleRepository, jwtService) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
    }
    async createUser(dto) {
        await this.verifyEmailDomain(dto.email);
        const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });
        if (existingUser) {
            throw new common_1.BadRequestException('Email is already registered');
        }
        const password_hash = await bcrypt.hash(dto.password, 10);
        const user = this.userRepository.create({
            first_name: dto.first_name,
            last_name: dto.last_name,
            email: dto.email,
            password_hash,
        });
        const savedUser = await this.userRepository.save(user);
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
    async verifyEmailDomain(email) {
        const domain = email.split('@')[1];
        if (!domain) {
            throw new common_1.BadRequestException('Email is not valid');
        }
        try {
            const mxRecords = await (0, promises_1.resolveMx)(domain);
            if (mxRecords && mxRecords.length > 0) {
                return;
            }
        }
        catch {
        }
        try {
            const aRecords = await (0, promises_1.resolve4)(domain);
            if (aRecords && aRecords.length > 0) {
                return;
            }
        }
        catch {
        }
        throw new common_1.BadRequestException('Email domain is not valid or cannot be verified');
    }
    async getUserById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        return user;
    }
    async getUserByEmail(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException(`User with email ${email} not found`);
        return user;
    }
    async getUserWithRoles(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['roles', 'roles.role'],
        });
        if (!user)
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        return user;
    }
    async updateUser(id, updateUserDto) {
        await this.getUserById(id);
        await this.userRepository.update(id, updateUserDto);
        return await this.getUserById(id);
    }
    async deleteProfile(id) {
        await this.getUserById(id);
        await this.userRepository.delete(id);
        return { message: `User with ID ${id} deleted successfully` };
    }
    async login(email, password) {
        const user = await this.getUserByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException('Wrong credentials');
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch)
            throw new common_1.UnauthorizedException('Wrong credentials');
        return {
            access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_roles_entity_1.UserRole)),
    __param(2, (0, typeorm_1.InjectRepository)(roles_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map