import { Test, TestingModule } from '@nestjs/testing';
import { OfflineService } from './offline.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AttendanceRecord } from '../attendance/entities/attendance-records.entity';
import { SessionStudent } from '../session/entities/session-students.entity';
import { Session } from '../session/entities/sessions.entity';

const mockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
});

const mockDataSource = {
  createQueryRunner: jest.fn(() => ({
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: { save: jest.fn() },
  })),
};

describe('OfflineService', () => {
  let service: OfflineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfflineService,
        { provide: getRepositoryToken(AttendanceRecord), useFactory: mockRepository },
        { provide: getRepositoryToken(SessionStudent), useFactory: mockRepository },
        { provide: getRepositoryToken(Session), useFactory: mockRepository },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<OfflineService>(OfflineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
