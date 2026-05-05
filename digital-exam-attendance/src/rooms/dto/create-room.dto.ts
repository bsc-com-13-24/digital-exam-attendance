import { IsString, IsNotEmpty, IsInt, IsBoolean, IsOptional, MaxLength, Min } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  room_code!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  building?: string;

  @IsInt()
  @Min(1)
  capacity!: number;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
