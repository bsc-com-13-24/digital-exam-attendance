import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { BulkMarkAttendanceDto } from './dto/bulk-mark-attendance.dto';
import { AttendanceQueryDto } from './dto/attendance-query.dto';
import { AttendanceRecord } from './entities/attendance-records.entity';
import { SessionStudent } from '../session/entities/session-students.entity';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    markAttendance(dto: CreateAttendanceDto, req: any): Promise<AttendanceRecord>;
    bulkMarkAttendance(dto: BulkMarkAttendanceDto, req: any): Promise<AttendanceRecord[]>;
    updateAttendance(id: string, dto: UpdateAttendanceDto, req: any): Promise<AttendanceRecord>;
    getAttendanceRecords(query: AttendanceQueryDto): Promise<AttendanceRecord[]>;
    searchStudentsForManualMark(sessionId: string, search: string): Promise<SessionStudent[]>;
}
