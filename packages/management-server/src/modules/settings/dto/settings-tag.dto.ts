import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class SettingsTagDto {
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  @IsOptional()
  @MaxLength(255)
  description?: string;
}
