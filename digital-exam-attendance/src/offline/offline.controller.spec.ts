import { Test, TestingModule } from '@nestjs/testing';
import { OfflineController } from './offline.controller';
import { OfflineService } from './offline.service';
import { SyncOfflineDto, AttendanceStatus, ScanMethod } from './dto/sync-offline.dto';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('OfflineController', () => {
  let controller: OfflineController;
  let offlineService: OfflineService;

  const mockOfflineService = {
    syncOfflineRecords: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfflineController],
      providers: [
        {
          provide: OfflineService,
          useValue: mockOfflineService,
        },
      ],
    }).compile();

    controller = module.get<OfflineController>(OfflineController);
    offlineService = module.get<OfflineService>(OfflineService);
  });

  describe('syncOfflineRecords', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should return success response with sync results', async () => {
      const syncDto: SyncOfflineDto = {
        deviceId: 'device-1',
        offlineRecords: [
          {
            localId: 'local-1',
            sessionId: 'session-1',
            studentId: 'student-1',
            status: AttendanceStatus.PRESENT,
            method: ScanMethod.SCAN,
            markedAt: '2024-04-28T10:00:00Z',
          },
        ],
      };

      const mockResult = {
        successCount: 1,
        failureCount: 0,
        failures: [],
      };

      mockOfflineService.syncOfflineRecords.mockResolvedValue(mockResult);

      const result = await controller.syncOfflineRecords(syncDto);

      expect(result).toEqual({
        success: true,
        message: 'Offline records synced successfully',
        data: mockResult,
      });
      expect(offlineService.syncOfflineRecords).toHaveBeenCalledWith(syncDto);
    });

    it('should handle partial failures', async () => {
      const syncDto: SyncOfflineDto = {
        deviceId: 'device-1',
        offlineRecords: [
          {
            localId: 'local-1',
            sessionId: 'session-1',
            studentId: 'student-1',
            status: AttendanceStatus.PRESENT,
            method: ScanMethod.SCAN,
            markedAt: '2024-04-28T10:00:00Z',
          },
          {
            localId: 'local-2',
            sessionId: 'session-1',
            studentId: 'student-2',
            status: AttendanceStatus.ABSENT,
            method: ScanMethod.MANUAL,
            markedAt: '2024-04-28T10:05:00Z',
          },
        ],
      };

      const mockResult = {
        successCount: 1,
        failureCount: 1,
        failures: [
          {
            localId: 'local-2',
            reason: 'Student not registered for session',
          },
        ],
      };

      mockOfflineService.syncOfflineRecords.mockResolvedValue(mockResult);

      const result = await controller.syncOfflineRecords(syncDto);

      expect(result.success).toBe(true);
      expect(result.data.successCount).toBe(1);
      expect(result.data.failureCount).toBe(1);
    });

    it('should re-throw BadRequestException', async () => {
      const syncDto: SyncOfflineDto = {
        deviceId: 'device-1',
        offlineRecords: [],
      };

      mockOfflineService.syncOfflineRecords.mockRejectedValue(
        new BadRequestException('No records provided'),
      );

      await expect(controller.syncOfflineRecords(syncDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should re-throw ConflictException', async () => {
      const syncDto: SyncOfflineDto = {
        deviceId: 'device-1',
        offlineRecords: [
          {
            localId: 'local-1',
            sessionId: 'session-1',
            studentId: 'student-1',
            status: AttendanceStatus.PRESENT,
            method: ScanMethod.SCAN,
            markedAt: '2024-04-28T10:00:00Z',
          },
        ],
      };

      mockOfflineService.syncOfflineRecords.mockRejectedValue(
        new ConflictException('Duplicate record'),
      );

      await expect(controller.syncOfflineRecords(syncDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should wrap unexpected errors in InternalServerErrorException', async () => {
      const syncDto: SyncOfflineDto = {
        deviceId: 'device-1',
        offlineRecords: [
          {
            localId: 'local-1',
            sessionId: 'session-1',
            studentId: 'student-1',
            status: AttendanceStatus.PRESENT,
            method: ScanMethod.SCAN,
            markedAt: '2024-04-28T10:00:00Z',
          },
        ],
      };

      mockOfflineService.syncOfflineRecords.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(controller.syncOfflineRecords(syncDto)).rejects.toThrow(
        'Failed to sync offline records',
      );
    });
  });
});
