import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SettingsCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  parentId: number;
}
