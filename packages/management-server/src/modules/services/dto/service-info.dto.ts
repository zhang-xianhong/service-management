import { IsNumber, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class ServiceInfoDto {
  @Matches(/^srv-[a-z0-9-]+(?<!-)$/)
  @IsString()
  @MaxLength(45)
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  owner: string;

  @IsString()
  @IsOptional()
  classification: string;

  @IsString()
  @IsOptional()
  tag: string;

  @IsString()
  @IsOptional()
  detail: string;

  @IsNumber()
  @IsOptional()
  serverPort: number;
}
