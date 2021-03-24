import { Type } from 'class-transformer';
import { IsString, IsEnum, ValidateNested, IsArray, IsOptional, IsNumber } from 'class-validator';
import { methodType } from '../service-api.model';
import { ApiParamDto } from './api-param.dto';

export class ApiDto {
  @IsString()
  readonly url: string;

  @IsEnum(methodType)
  readonly method: methodType;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  @IsOptional()
  readonly isSystem: number;

  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  @Type(() => ApiParamDto)
  readonly params: ApiParamDto[];
}
