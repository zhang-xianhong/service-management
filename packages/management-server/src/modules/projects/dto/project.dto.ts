import { IsEnum, IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';
import { PROJECT_LEVEL, PROJECT_LICENSE } from '../config';

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

  @IsNotEmpty()
  @IsEnum(PROJECT_LICENSE)
  @IsNumber()
  license: number;

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


/**
 * 更新
 * 传啥更新啥
 */
export class ProjectUpdateDto {
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  templateId: number;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(PROJECT_LEVEL)
  @IsNumber()
  level: number;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(PROJECT_LICENSE)
  @IsNumber()
  license: number;

  @IsOptional()
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
