import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateNested } from 'class-validator';
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
  @IsOptional()
  @MinLength(2)
  @MaxLength(40)
  nameShort: string;

  @IsString()
  industryId: string;

  @IsString()
  natureId: string;

  @IsString()
  scaleId: string;

  @IsString()
  license: string;

  @IsOptional()
  addr: string | number;

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
