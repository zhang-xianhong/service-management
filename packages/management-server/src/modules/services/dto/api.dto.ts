import { Type } from 'class-transformer';
import { IsString, IsEnum, ValidateNested, IsArray, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { METHOD_TYPE } from '../default-apis';
import { ApiParamDto } from './api-param.dto';

export class ApiDto {
  @IsString()
  readonly url: string;

  @IsEnum(METHOD_TYPE)
  readonly method: METHOD_TYPE;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly modelId: number;

  @IsBoolean()
  @IsOptional()
  readonly isSystem: boolean;

  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  @Type(() => ApiParamDto)
  readonly params: ApiParamDto[];
}
