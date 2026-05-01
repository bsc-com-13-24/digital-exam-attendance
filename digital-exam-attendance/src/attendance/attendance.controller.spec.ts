import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthService } from '../auth/auth.service';

const mockAttendanceService = {
  markAttendance: jest.fn(),
  bulkMarkAttendance: jest.fn(),
  updateAttendance: jest.fn(),
  getAttendanceRecords: jest.fn(),
  getAttendanceReport: jest.fn(),
  searchStudentsForManualMark: jest.fn(),
};

describe('AttendanceController', () => {
  let controller: AttendanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [
        { provide: AttendanceService, useValue: mockAttendanceService },
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn() } },
        { provide: AuthService, useValue: { getUserWithRoles: jest.fn() } },
        { provide: RolesGuard, useValue: { canActivate: jest.fn(() => true) } },
      ],
    }).compile();

    controller = module.get<AttendanceController>(AttendanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
