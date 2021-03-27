// 请注意，执行器的顺序是从下往上执行的
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, MaxLength, Validate, ValidateNested } from 'class-validator';
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

  @IsOptional()
  @IsBoolean()
  notNull: boolean;

  @IsOptional()
  @IsBoolean()
  isUnique: boolean;

  @IsOptional()
  @IsBoolean()
  isIndex: boolean;

  @IsOptional()
  @IsBoolean()
  isParticipleSupport: boolean;

  @IsOptional()
  @MaxLength(255)
  defaultValue: string | number | null;

  @IsOptional()
  @IsBoolean()
  isPinyinSupport: boolean;

  @IsOptional()
  foreignId: string;
}


// 深度校验
export class ModelFieldsDto {
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => ModelFieldDto)
  fields?: ModelFieldDto[];
}
