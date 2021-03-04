// 请注意，执行器的顺序是从下往上执行的
import {  ArrayNotEmpty, IsArray,  IsNotEmpty, Validate,  ValidateNested } from 'class-validator';
import { UpperCamel } from '../../shared/validators/upper-camel';
import { ModelFieldDto } from './model-field.dto';


export class ModelInfoDto {
  @Validate(UpperCamel, {})
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  owner: string;
  modelRank: string;
  classification: string;
  tags: string;
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  // @Type(value => ModelFieldDto)
  fields: ModelFieldDto[];
}

