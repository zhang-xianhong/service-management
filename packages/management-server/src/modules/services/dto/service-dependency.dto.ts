import { IsString, IsInt } from 'class-validator';

export class ServiceDependencyDto {
  @IsInt()
  readonly dependencyId: number;

  @IsString()
  readonly remark: string;
}
