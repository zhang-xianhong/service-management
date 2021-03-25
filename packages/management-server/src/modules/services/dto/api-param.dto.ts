import { IsString, IsEnum, IsNumber } from 'class-validator';
import { PARAM_TYPE } from '../default-apis';

export class ApiParamDto {
  @IsString()
  readonly name: string;

  @IsEnum(PARAM_TYPE)
  readonly paramType: PARAM_TYPE;

  @IsNumber()
  readonly required: number;

  @IsNumber()
  readonly paramOrder: number;

  @IsString()
  readonly description: string;
}
