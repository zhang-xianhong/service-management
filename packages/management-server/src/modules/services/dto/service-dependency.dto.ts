import { IsString, IsOptional, IsNumber } from 'class-validator';

export class ServiceDependencyDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  @IsOptional()
  readonly remark: string;
}
