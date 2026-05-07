import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsBoolean, IsOptional, MaxLength, Min } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'A101' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  room_code!: string;

  @ApiProperty({ example: 'Room A', description: 'Room Name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ example: 'Building A', description: 'Building Name' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  building?: string;

  @ApiProperty({ example: 100, description: 'Capacity of the room' })
  @IsInt()
  @Min(1)
  capacity!: number;

  @ApiProperty({ example: true, description: 'Is the room active?' })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
