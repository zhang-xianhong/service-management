// 请注意，执行器的顺序是从下往上执行的
import { IsBoolean, IsNotEmpty, IsOptional, MaxLength, Validate } from 'class-validator';
import { LowerCamel } from 'src/shared/validators/lower-camel';

export class ModelFieldDto {
  @Validate(LowerCamel, {})
  @MaxLength(64)
  @IsNotEmpty()
  name: string;

  @MaxLength(255)
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  typeId: number;

  @IsBoolean()
  notNull: boolean;

  @IsBoolean()
  isUnique: boolean;

  @IsBoolean()
  isIndex: boolean;

  @IsBoolean()
  isParticipleSupport: boolean;

  @IsBoolean()
  isPinyinSupport: boolean;

  @IsOptional()
  foreignId: string;
}
