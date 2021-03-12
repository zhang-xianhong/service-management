import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, Matches, MaxLength, ValidateNested } from 'class-validator';
import { ServiceApiDto } from './service-api.dto';

export class ServiceInfoDto {
  @Matches(/^srv-[a-z0-9-]+(?<!-)$/)
  @IsString()
  @MaxLength(45)
  readonly name: string;

  @IsString()
  readonly url: string;

  @IsString()
  readonly moduleDependencyId: string;

  @IsString()
  readonly owner: string;

  @IsString()
  readonly classification: string;

  @IsString()
  readonly tag: string;

  @IsString()
  readonly cloneBy: string;

  @IsString()
  readonly description: string;

  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmpty()
  @Type(() => ServiceApiDto)
  readonly apis?: ServiceApiDto[];
}
