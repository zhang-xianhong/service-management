import { IsString, IsInt, IsOptional } from 'class-validator';

export class ServiceDependencyDto {
  @IsInt()
  readonly dependencyId: number;

  @IsString()
  @IsOptional()
  readonly remark: string;
}
