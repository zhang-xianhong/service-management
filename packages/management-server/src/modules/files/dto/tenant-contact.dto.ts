import { IsEmail, IsPhoneNumber, IsString, Matches, MaxLength, MinLength, Validate } from 'class-validator';
import { CustomIdentityCard } from 'src/shared/validators/identity-card';

export class TenantContactDto {
  @Matches(/^[\u4e00-\u9fa5]+$/)
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsPhoneNumber('CN')
  @IsString()
  phone: string;

  @Validate(CustomIdentityCard)
  @IsString()
  IDCard: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  frontPhoto: string;

  @IsString()
  reversePhoto: string;
}
