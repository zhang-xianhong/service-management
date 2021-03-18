import { IsNumber, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class ServiceInfoDto {
  @Matches(/^srv-[a-z0-9-]+(?<!-)$/)
  @IsString()
  @MaxLength(45)
  name: string;

  @IsString()
  description: string;

  @IsString()
  owner: string;

  @IsString()
  classification: string;

  @IsString()
  tag: string;

  @IsString()
  detail: string;

  @IsNumber()
  @IsOptional()
  serverPort: number;
}
