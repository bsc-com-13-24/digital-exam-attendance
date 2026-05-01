import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/users.entity';
import { UserRole } from './entities/user-roles.entity';
import { Role } from './entities/roles.entity';

const mockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useFactory: mockRepository },
        { provide: getRepositoryToken(UserRole), useFactory: mockRepository },
        { provide: getRepositoryToken(Role), useFactory: mockRepository },
        { provide: JwtService, useValue: { sign: jest.fn(() => 'test-token') } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
