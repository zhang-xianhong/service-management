// 请注意，执行器的顺序是从下往上执行的
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, MaxLength, Validate,  ValidateNested } from 'class-validator';
import { UpperCamel } from 'src/shared/validators/upper-camel';
import { ModelFieldDto } from './model-field.dto';


export class ModelInfoDto {
  @Validate(UpperCamel, {})
  @IsNotEmpty()
  @MaxLength(64)
  name: string;
  @IsNotEmpty()
  @MaxLength(255)
  description: string;
  @IsOptional()
  owner: string;
  @IsOptional()
  modelRank: string;
  @IsOptional()
  classification: string;
  @IsOptional()
  tags: string;
  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmpty()
  @Type(() => ModelFieldDto)
  fields: ModelFieldDto[];
}

