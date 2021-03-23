import { IsString, IsInt, IsOptional } from 'class-validator';

export class ServiceDependencyDto {
  @IsInt()
  readonly id: number;

  @IsString()
  @IsOptional()
  readonly remark: string;
}
