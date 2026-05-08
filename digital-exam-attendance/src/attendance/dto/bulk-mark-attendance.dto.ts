import { IsString, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAttendanceDto } from './create-attendance.dto';

export class BulkMarkAttendanceDto {
  @IsString()
  @IsNotEmpty()
  session_id!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttendanceDto)
  records!: CreateAttendanceDto[];
}
