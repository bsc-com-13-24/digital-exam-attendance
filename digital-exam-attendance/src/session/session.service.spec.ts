import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Session } from './entities/sessions.entity';
import { Course } from '../courses/entities/courses.entity';
import { SessionStudent } from './entities/session-students.entity';
import { RoomsService } from '../rooms/rooms.service';
import { CoursesService } from '../courses/courses.service';
import { AuthService } from '../auth/auth.service';

const mockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        { provide: getRepositoryToken(Session), useFactory: mockRepository },
        { provide: getRepositoryToken(Course), useFactory: mockRepository },
        { provide: getRepositoryToken(SessionStudent), useFactory: mockRepository },
        { provide: RoomsService, useValue: {} },
        { provide: CoursesService, useValue: {} },
        { provide: AuthService, useValue: {} },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
