import { IsString, IsNotEmpty, IsInt, IsBoolean, IsOptional, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ example: 'LT1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  room_code!: string;

  @ApiProperty({ example: 'Lecture Theatre 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ required: false, example: 'Main Block' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  building?: string;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(1)
  capacity!: number;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
