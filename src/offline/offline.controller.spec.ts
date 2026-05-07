import { Test, TestingModule } from '@nestjs/testing';
import { OfflineController } from './offline.controller';
import { OfflineService } from './offline.service';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthService } from '../auth/auth.service';

const mockOfflineService = {
  syncOfflineRecords: jest.fn(),
};

describe('OfflineController', () => {
  let controller: OfflineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfflineController],
      providers: [
        { provide: OfflineService, useValue: mockOfflineService },
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn() } },
        { provide: AuthService, useValue: { getUserWithRoles: jest.fn() } },
        { provide: RolesGuard, useValue: { canActivate: jest.fn(() => true) } },
      ],
    }).compile();

    controller = module.get<OfflineController>(OfflineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
