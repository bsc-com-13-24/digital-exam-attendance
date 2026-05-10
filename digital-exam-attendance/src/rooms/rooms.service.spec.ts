import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from './entities/rooms.entity';
import { SessionStudent } from '../session/entities/session-students.entity';
import { AttendanceRecord } from '../attendance/entities/attendance-records.entity';

describe('RoomsService', () => {
  let service: RoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: getRepositoryToken(Room),
          useValue: {},
        },
        {
          provide: getRepositoryToken(SessionStudent),
          useValue: {},
        },
        {
          provide: getRepositoryToken(AttendanceRecord),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
