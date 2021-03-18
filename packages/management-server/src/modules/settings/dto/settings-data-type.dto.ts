import { IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { FIELD_TYPES } from 'src/shared/constants/field-types';

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
  length: number;
}
