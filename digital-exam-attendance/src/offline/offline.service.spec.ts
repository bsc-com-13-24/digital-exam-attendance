import { Test, TestingModule } from '@nestjs/testing';
import { OfflineService } from './offline.service';
import { AttendanceRecord } from '../attendance/entities/attendance-records.entity';
import { SessionStudent } from '../session/entities/session-students.entity';
import { Session } from '../session/entities/sessions.entity';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { SyncOfflineDto, OfflineAttendanceRecordDto, ScanMethod } from './dto/sync-offline.dto';
import { AttendanceStatus } from '../attendance/entities/attendance-records.entity';
import { DataSource } from 'typeorm';

describe('OfflineService', () => {
  let service: OfflineService;
  let mockDataSource: any;
  let mockAttendanceRepo: any;
  let mockSessionStudentRepo: any;
  let mockSessionRepo: any;
  let mockQueryRunner: any;

  beforeEach(async () => {
    mockSessionRepo = {
      find: jest.fn(),
    };

    mockAttendanceRepo = {
      createQueryBuilder: jest.fn(),
    };
    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
      },
    };

    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfflineService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: 'SessionRepository',
          useValue: mockSessionRepo,
        },
        {
          provide: 'AttendanceRecordRepository',
          useValue: mockAttendanceRepo,
        },
      ],
    }).compile();

    service = module.get<OfflineService>(OfflineService);
  });

  describe('syncOfflineRecords', () => {
    it('should throw BadRequestException if no records provided', async () => {
      const syncDto: SyncOfflineDto = {
        deviceId: 'device-1',
        offlineRecords: [],
      };

      await expect(service.syncOfflineRecords(syncDto, 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should successfully sync valid offline records', async () => {
      const mockSession = { id: 'session-1' };
      mockSessionRepo.find.mockResolvedValueOnce([mockSession]);

      const mockSessionStudent = { id: 'session-student-1' };
      const mockRecord: OfflineAttendanceRecordDto = {
        localId: 'local-1',
        sessionId: 'session-1',
        studentNumber: 'student-1',
        status: AttendanceStatus.PRESENT,
        method: ScanMethod.SCAN,
        markedAt: '2024-04-28T10:00:00Z',
        remarks: 'Test remarks',
      };

      const syncDto: SyncOfflineDto = {
        deviceId: 'device-1',
        offlineRecords: [mockRecord],
      };

      mockQueryRunner.manager.findOne
        .mockResolvedValueOnce(mockSessionStudent)
        .mockResolvedValueOnce(null);
      mockQueryRunner.manager.create.mockReturnValue({
        session_id: 'session-1',
        student_id: 'student-1',
      });

      const result = await service.syncOfflineRecords(syncDto, 'user-1');

      expect(result.successCount).toBe(1);
      expect(result.failureCount).toBe(0);
      expect(result.failures).toHaveLength(0);
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should handle missing session error', async () => {
      const mockRecord: OfflineAttendanceRecordDto = {
        localId: 'local-1',
        sessionId: 'session-1',
        studentNumber: 'student-1',
        status: AttendanceStatus.PRESENT,
        method: ScanMethod.SCAN,
        markedAt: '2024-04-28T10:00:00Z',
      };

      const syncDto: SyncOfflineDto = {
        deviceId: 'device-1',
        offlineRecords: [mockRecord],
      };

      mockSessionRepo.find.mockResolvedValueOnce([]);

      mockQueryRunner.manager.findOne.mockResolvedValueOnce(null);
      const result = await service.syncOfflineRecords(syncDto, 'user-1');

      expect(result.failureCount).toBe(1);
      expect(result.failures[0].reason).toContain('not found');
    });

    it('should handle student not registered error', async () => {
      const syncDto: SyncOfflineDto = {
        deviceId: 'device-1',
        offlineRecords: [{
          localId: 'local-1',
          sessionId: 'session-1',
          studentNumber: 'student-1',
          status: AttendanceStatus.PRESENT,
          method: ScanMethod.SCAN,
          markedAt: '2024-04-28T10:00:00Z',
        }],
      };

      const mockSession = { id: 'session-1' };
      mockSessionRepo.find.mockResolvedValueOnce([mockSession]);

      mockQueryRunner.manager.findOne
        .mockResolvedValueOnce(null);
      const result = await service.syncOfflineRecords(syncDto, 'user-1');

      expect(result.failureCount).toBe(1);
      expect(result.failures[0].reason).toContain('not registered');
    });

    it('should handle duplicate attendance record error with LWW', async () => {
      const mockSession = { id: 'session-1' };
      mockSessionRepo.find.mockResolvedValueOnce([mockSession]);

      const mockSessionStudent = { id: 'session-student-1' };
      const mockExistingRecord = { id: 'existing-1', marked_at: new Date('2024-04-28T10:05:00Z') };

      const mockRecord: OfflineAttendanceRecordDto = {
        localId: 'local-1',
        sessionId: 'session-1',
        studentNumber: 'student-1',
        status: AttendanceStatus.PRESENT,
        method: ScanMethod.SCAN,
        markedAt: '2024-04-28T10:00:00Z', // older than existing
      };

      const syncDto: SyncOfflineDto = {
        deviceId: 'device-1',
        offlineRecords: [mockRecord],
      };

      mockQueryRunner.manager.findOne
        .mockResolvedValueOnce(mockSessionStudent)
        .mockResolvedValueOnce(mockExistingRecord);

      const result = await service.syncOfflineRecords(syncDto, 'user-1');

      // Now LWW succeeds but skips saving if older. Result should be success, not failure!
      expect(result.successCount).toBe(1);
      expect(result.failureCount).toBe(0);
      expect(mockQueryRunner.manager.save).not.toHaveBeenCalled();
    });

    it('should process multiple records and track both successes and failures', async () => {
      const mockSession = { id: 'session-1' };
      const mockSessionStudent = { id: 'session-student-1' };

      const records: OfflineAttendanceRecordDto[] = [
        {
          localId: 'local-1',
          sessionId: 'session-1',
          studentNumber: 'student-1',
          status: AttendanceStatus.PRESENT,
          method: ScanMethod.SCAN,
          markedAt: '2024-04-28T10:00:00Z',
        },
        {
          localId: 'local-2',
          sessionId: 'session-1',
          studentNumber: 'student-2',
          status: AttendanceStatus.ABSENT,
          method: ScanMethod.MANUAL,
          markedAt: '2024-04-28T10:05:00Z',
        },
      ];

      const syncDto: SyncOfflineDto = {
        deviceId: 'device-1',
        offlineRecords: records,
      };

      mockSessionRepo.find.mockResolvedValueOnce([mockSession]);

      mockQueryRunner.manager.findOne
        .mockResolvedValueOnce(mockSessionStudent)
        .mockResolvedValueOnce(null)
        // record 2 fails on finding student
        .mockResolvedValueOnce(null);

      mockQueryRunner.manager.create.mockReturnValue({});

      const result = await service.syncOfflineRecords(syncDto, 'user-1');

      expect(result.successCount).toBe(1);
      expect(result.failureCount).toBe(1);
      expect(result.failures).toHaveLength(1);
    });

    it('should rollback transaction on critical error', async () => {
      mockSessionRepo.find.mockResolvedValueOnce([{ id: 'session-1' }]);

      mockQueryRunner.startTransaction.mockRejectedValueOnce(
        new Error('Transaction error'),
      );

      const syncDto: SyncOfflineDto = {
        deviceId: 'device-1',
        offlineRecords: [
          {
            localId: 'local-1',
            sessionId: 'session-1',
            studentNumber: 'student-1',
            status: AttendanceStatus.PRESENT,
            method: ScanMethod.SCAN,
            markedAt: '2024-04-28T10:00:00Z',
          },
        ],
      };

      await expect(service.syncOfflineRecords(syncDto, 'user-1')).rejects.toThrow();
    });
  });
});
