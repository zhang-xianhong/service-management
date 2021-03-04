// 请注意，执行器的顺序是从下往上执行的
import {  IsBoolean, IsNotEmpty, Validate } from 'class-validator';
import { LowerCamel } from 'src/shared/validators/lower-camel';

export class ModelFieldDto {
  @Validate(LowerCamel, {})
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  type: string;
  @IsBoolean()
  notNull: boolean;
  @IsBoolean()
  isSystem: boolean;
  @IsBoolean()
  isUnique: boolean;
  @IsBoolean()
  isIndex: boolean;
  @IsBoolean()
  isParticipleSupport: boolean;
  @IsBoolean()
  isPinyinSupport: boolean;
  foreignId: string;
}
