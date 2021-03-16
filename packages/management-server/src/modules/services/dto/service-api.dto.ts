import { IsString, IsEnum, IsUrl } from 'class-validator';
import { methodType, paramType } from '../service-api.entity';

export class ServiceApiDto {
  @IsString()
  @IsUrl()
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
