import {  IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class TenantUpdateInfoDto {
  @Matches(/^[\u4e00-\u9fa5a-zA-Z\\(\\)]+$/, {
    message: '只能输入中文、大小写字母及()',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  nameShort: string;

  @IsOptional()
  addr: string | number;

  @IsString()
  @IsOptional()
  addrDetail: string;

  @IsString()
  @IsOptional()
  intro: string;

  @IsString()
  @IsOptional()
  logoUrl: string;
}
