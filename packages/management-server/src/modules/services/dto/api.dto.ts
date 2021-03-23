import { Type } from 'class-transformer';
import { IsString, IsEnum, IsUrl, ValidateNested, IsArray, IsOptional } from 'class-validator';
import { methodType } from '../service-api.model';
import { ApiParamDto } from './api-param.dto';

export class ApiDto {
  @IsString()
  @IsUrl()
  readonly url: string;

  @IsEnum(methodType)
  readonly method: methodType;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  @Type(() => ApiParamDto)
  readonly params: ApiParamDto[];
}
