import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthService } from '../auth/auth.service';

const mockSessionService = {
  createSession: jest.fn(),
  getAllSessions: jest.fn(),
  getSessionById: jest.fn(),
  updateSession: jest.fn(),
  removeSession: jest.fn(),
  createCourse: jest.fn(),
  getAllCourse: jest.fn(),
  getCourseById: jest.fn(),
  updateCourse: jest.fn(),
  removeCourse: jest.fn(),
  enrollStudents: jest.fn(),
  getStudentsBySessionId: jest.fn(),
};

describe('SessionController', () => {
  let controller: SessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn() } },
        { provide: AuthService, useValue: { getUserWithRoles: jest.fn() } },
        { provide: RolesGuard, useValue: { canActivate: jest.fn(() => true) } },
      ],
    }).compile();

    controller = module.get<SessionController>(SessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
