import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { TenantContactDto } from './tenant-contact.dto';
import { TenantManagerDto } from './tenant-manager.dto';

export class TenantInfoDto {
  @Matches(/^[\u4e00-\u9fa5a-zA-Z\\(\\)]+$/, {
    message: '只能输入中文、大小写字母及()',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  name: string;

  @Matches(/^[\u4e00-\u9fa5a-zA-Z\\(\\)]+$/, {
    message: '只能输入中文、大小写字母及()',
  })
  @IsString()
  @Optional()
  @MinLength(2)
  @MaxLength(40)
  nameShort: string;

  @IsNumber()
  industryId: number;

  @IsNumber()
  natureId: number;

  @IsNumber()
  scaleId: number;

  @IsString()
  license: string;

  @IsString()
  @IsOptional()
  addr: string;

  @IsString()
  @IsOptional()
  addrDetail: string;

  @IsString()
  @IsOptional()
  intro: string;

  @IsString()
  licenseUrl: string;

  @IsString()
  @IsOptional()
  logoUrl: string;

  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => TenantContactDto)
  readonly contact: TenantContactDto;

  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => TenantManagerDto)
  readonly manager: TenantManagerDto;
}
