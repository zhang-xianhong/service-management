import { IsEnum, IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';
import { PROJECT_LEVEL } from '../config';

export class ProjectDto {
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  templateId: number;

  @IsNotEmpty()
  @IsEnum(PROJECT_LEVEL)
  @IsNumber()
  level: number;

  @IsOptional()
  owner: string;

  @IsOptional()
  thumbnail: string;

  @IsOptional()
  @MaxLength(255)
  remark: string;

  @IsOptional()
  status: number;
}

