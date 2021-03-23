import { Type } from 'class-transformer';
import {  ValidateNested, IsNotEmpty, IsArray } from 'class-validator';
import { ApiDto } from './api.dto';

export class ServiceApisDto {
  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmpty()
  @Type(() => ApiDto)
  readonly apis: ApiDto[];
}
