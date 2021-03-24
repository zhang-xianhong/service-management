import { IsEnum, IsInt, IsNotEmpty, IsOptional, Max, MaxLength, Min } from 'class-validator';
import { FIELD_TYPES } from 'src/shared/constants/field-types';

// LONG TEXT 是最大长度为 4,294,967,295 字符
const MAX_BYTES = 4294967295;
export class SettingsDataTypeDto {
  @IsEnum(FIELD_TYPES, {
    message: `类型必须必须是${Object.values(FIELD_TYPES)}的一种`,
  })
  @IsNotEmpty()
  type: FIELD_TYPES;

  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(MAX_BYTES)
  length: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  precision: number;
}
