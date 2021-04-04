import { IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class TenantManagerDto {
  @Matches(/^[a-z0-9-]+(?<!-)$/, {
    message: '只能输入小写字母、数字、中划线',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  account: string;

  @Matches(/^[\u4e00-\u9fa5]+$/)
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  name: string;

  @IsPhoneNumber('CN')
  @IsString()
  phone: number;

  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: '只能输入大小写字母、数字、下划线',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}
