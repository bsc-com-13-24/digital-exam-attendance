import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthService } from '../auth/auth.service';

const mockDashboardService = {
  getSessionLiveDashboard: jest.fn(),
  getSessionStatistics: jest.fn(),
  getSessionAttendanceReport: jest.fn(),
  getOverallStatistics: jest.fn(),
};

describe('DashboardController', () => {
  let controller: DashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn() } },
        { provide: AuthService, useValue: { getUserWithRoles: jest.fn() } },
        { provide: RolesGuard, useValue: { canActivate: jest.fn(() => true) } },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
