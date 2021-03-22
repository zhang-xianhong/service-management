import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, ValidateNested } from 'class-validator';
import { ServiceDependencyDto } from './service-dependency.dto';

export class ServiceInfoDto {
  @Matches(/^srv-[a-z0-9-]+(?<!-)$/)
  @IsString()
  @MaxLength(45)
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  owner: string;

  @IsString()
  @IsOptional()
  classification: string;

  @IsString()
  @IsOptional()
  tag: string;

  @IsString()
  @IsOptional()
  detail: string;

  @IsNumber()
  @IsOptional()
  serverPort: number;

  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmpty()
  @Type(() => ServiceDependencyDto)
  readonly dependencies?: ServiceDependencyDto[];
}
