import { CreateAttendanceDto } from './create-attendance.dto';
import { AttendanceStatus } from '../entities/attendance-records.entity';
declare const UpdateAttendanceDto_base: import("@nestjs/common").Type<Partial<CreateAttendanceDto>>;
export declare class UpdateAttendanceDto extends UpdateAttendanceDto_base {
    status?: AttendanceStatus;
    method?: string;
    remarks?: string;
    marked_by?: string;
}
export {};
