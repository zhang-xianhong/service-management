// 请注意，执行器的顺序是从下往上执行的
import { IsNotEmpty, IsNumber, IsOptional, MaxLength, Validate } from 'class-validator';
import { UpperCamel } from 'src/shared/validators/upper-camel';

export class ModelInfoDto {
  @Validate(UpperCamel, {})
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  serviceId: number;

  @IsOptional()
  owner: string;

  @IsOptional()
  modelRank: string;

  @IsOptional()
  classification: string;

  @IsOptional()
  tags: string;
}

