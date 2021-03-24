import { IsNumber, IsObject } from 'class-validator';

export class ServiceConfigDto {
  @IsNumber()
  readonly serviceId: number;

  @IsObject()
  readonly config: JSON;
}
