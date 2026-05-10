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
var OfflineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const attendance_records_entity_1 = require("../attendance/entities/attendance-records.entity");
const session_students_entity_1 = require("../session/entities/session-students.entity");
const sessions_entity_1 = require("../session/entities/sessions.entity");
let OfflineService = OfflineService_1 = class OfflineService {
    dataSource;
    logger = new common_1.Logger(OfflineService_1.name);
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async syncOfflineRecords(syncDto, userId) {
        if (!syncDto.offlineRecords || syncDto.offlineRecords.length === 0) {
            throw new common_1.BadRequestException('No offline records provided');
        }
        this.logger.log(`Starting sync for device ${syncDto.deviceId} with ${syncDto.offlineRecords.length} records`);
        const result = {
            successCount: 0,
            failureCount: 0,
            failures: [],
        };
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const record of syncDto.offlineRecords) {
                try {
                    await this.validateAndSyncRecord(record, userId, queryRunner);
                    result.successCount++;
                }
                catch (error) {
                    result.failureCount++;
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    result.failures.push({
                        localId: record.localId,
                        reason: errorMessage,
                    });
                    this.logger.warn(`Failed to sync record ${record.localId}: ${errorMessage}`);
                }
            }
            await queryRunner.commitTransaction();
            this.logger.log(`Sync completed - Success: ${result.successCount}, Failures: ${result.failureCount}`);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Sync transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw new common_1.BadRequestException('Sync operation failed, all changes rolled back');
        }
        finally {
            await queryRunner.release();
        }
        return result;
    }
    async validateAndSyncRecord(record, userId, queryRunner) {
        const session = await queryRunner.manager.findOne(sessions_entity_1.Session, {
            where: { id: record.sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session ${record.sessionId} not found`);
        }
        const sessionStudent = await queryRunner.manager.findOne(session_students_entity_1.SessionStudent, {
            where: {
                session_id: record.sessionId,
                student_number: record.studentNumber,
            },
        });
        if (!sessionStudent) {
            throw new common_1.BadRequestException(`Student ${record.studentNumber} is not registered for session ${record.sessionId}`);
        }
        const existingRecord = await queryRunner.manager.findOne(attendance_records_entity_1.AttendanceRecord, {
            where: {
                session_id: record.sessionId,
                session_student_id: sessionStudent.id,
            },
        });
        if (existingRecord) {
            throw new common_1.ConflictException(`Attendance already recorded for student in session ${record.sessionId}`);
        }
        const markedAt = new Date(record.markedAt);
        if (Number.isNaN(markedAt.getTime())) {
            throw new common_1.BadRequestException(`Invalid markedAt timestamp: ${record.markedAt}`);
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
};
exports.OfflineService = OfflineService;
exports.OfflineService = OfflineService = OfflineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], OfflineService);
//# sourceMappingURL=offline.service.js.map