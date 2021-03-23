import { IsString, IsEnum, IsNumber } from 'class-validator';
import { paramType } from '../service-api-param.model';

export class ApiParamDto {
  @IsString()
  readonly name: string;

  @IsEnum(paramType)
  readonly paramType: paramType;

  @IsNumber()
  readonly required: number;

  @IsNumber()
  readonly paramOrder: number;

  @IsString()
  readonly description: string;
}
