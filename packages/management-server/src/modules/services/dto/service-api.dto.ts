import { IsString, IsEnum } from 'class-validator';
import { methodType, paramType } from '../service-api.entity';

export class ServiceApiDto {
  @IsString()
  readonly url: string;

  @IsEnum(methodType)
  readonly method: methodType;

  @IsEnum(paramType)
  readonly paramType: paramType;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;
}
