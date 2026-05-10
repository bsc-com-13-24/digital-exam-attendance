"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OfflineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_records_entity_1 = require("../attendance/entities/attendance-records.entity");
const session_students_entity_1 = require("../session/entities/session-students.entity");
const sessions_entity_1 = require("../session/entities/sessions.entity");
let OfflineService = OfflineService_1 = class OfflineService {
    dataSource;
    sessionRepo;
    attendanceRepo;
    logger = new common_1.Logger(OfflineService_1.name);
    constructor(dataSource, sessionRepo, attendanceRepo) {
        this.dataSource = dataSource;
        this.sessionRepo = sessionRepo;
        this.attendanceRepo = attendanceRepo;
    }
    async syncOfflineRecords(syncDto, userId) {
        if (!syncDto.offlineRecords?.length) {
            throw new common_1.BadRequestException('No offline records provided');
        }
        this.logger.log(`Starting sync for device ${syncDto.deviceId} with ${syncDto.offlineRecords.length} records`);
        const result = {
            successCount: 0,
            failureCount: 0,
            failures: [],
        };
        const sessionIds = [...new Set(syncDto.offlineRecords.map(r => r.sessionId))];
        const sessions = await this.sessionRepo.find({ where: { id: (0, typeorm_2.In)(sessionIds) } });
        const sessionMap = new Map(sessions.map(s => [s.id, s]));
        for (const record of syncDto.offlineRecords) {
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                await this.validateAndSyncRecord(record, userId, queryRunner, sessionMap);
                await queryRunner.commitTransaction();
                result.successCount++;
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                result.failureCount++;
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                result.failures.push({
                    localId: record.localId,
                    code: error.syncErrorCode ?? 'UNKNOWN_ERROR',
                    reason: errorMessage,
                });
                this.logger.warn(`Failed to sync record ${record.localId}: ${errorMessage}`);
            }
            finally {
                await queryRunner.release();
            }
        }
        this.logger.log(`Sync completed - Success: ${result.successCount}, Failures: ${result.failureCount}`);
        if (syncDto.lastSyncTimestamp) {
            const serverUpdates = await this.getServerUpdates(syncDto.lastSyncTimestamp, sessionIds);
            result.serverUpdates = serverUpdates;
        }
        return result;
    }
    async validateAndSyncRecord(record, userId, queryRunner, sessionMap) {
        const session = sessionMap.get(record.sessionId);
        if (!session) {
            const err = new common_1.NotFoundException(`Session ${record.sessionId} not found`);
            err.syncErrorCode = 'SESSION_NOT_FOUND';
            throw err;
        }
        const sessionStudent = await queryRunner.manager.findOne(session_students_entity_1.SessionStudent, {
            where: {
                session_id: record.sessionId,
                student_number: record.studentNumber,
            },
        });
        if (!sessionStudent) {
            const err = new common_1.BadRequestException(`Student ${record.studentNumber} is not registered for session ${record.sessionId}`);
            err.syncErrorCode = 'STUDENT_NOT_REGISTERED';
            throw err;
        }
        const markedAt = new Date(record.markedAt);
        if (Number.isNaN(markedAt.getTime())) {
            const err = new common_1.BadRequestException(`Invalid markedAt timestamp: ${record.markedAt}`);
            err.syncErrorCode = 'INVALID_TIMESTAMP';
            throw err;
        }
        const existingRecord = await queryRunner.manager.findOne(attendance_records_entity_1.AttendanceRecord, {
            where: {
                session_id: record.sessionId,
                session_student_id: sessionStudent.id,
            },
        });
        if (existingRecord) {
            const incomingTime = markedAt.getTime();
            const existingTime = existingRecord.marked_at ? existingRecord.marked_at.getTime() : 0;
            if (incomingTime > existingTime) {
                existingRecord.status = record.status;
                existingRecord.method = record.method;
                existingRecord.marked_at = markedAt;
                existingRecord.remarks = record.remarks || null;
                existingRecord.marked_by = userId;
                await queryRunner.manager.save(existingRecord);
            }
            return;
        }
        const attendanceRecord = queryRunner.manager.create(attendance_records_entity_1.AttendanceRecord, {
            session_id: record.sessionId,
            session_student_id: sessionStudent.id,
            status: record.status,
            method: record.method,
            marked_at: markedAt,
            remarks: record.remarks || null,
            marked_by: userId,
        });
        await queryRunner.manager.save(attendanceRecord);
    }
    async getServerUpdates(lastSyncTimestamp, sessionIds) {
        if (!sessionIds.length)
            return [];
        return this.attendanceRepo
            .createQueryBuilder("record")
            .where("record.session_id IN (:...sessionIds)", { sessionIds })
            .andWhere("record.updated_at > :since", {
            since: new Date(lastSyncTimestamp)
        })
            .getMany();
    }
};
exports.OfflineService = OfflineService;
exports.OfflineService = OfflineService = OfflineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(sessions_entity_1.Session)),
    __param(2, (0, typeorm_1.InjectRepository)(attendance_records_entity_1.AttendanceRecord)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OfflineService);
//# sourceMappingURL=offline.service.js.map