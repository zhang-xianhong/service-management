import { IsNumber, IsString } from 'class-validator';

export class SettingsCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  parentId: number;
}
