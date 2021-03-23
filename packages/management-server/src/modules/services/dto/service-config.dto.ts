import {  IsInt, IsObject } from 'class-validator';

export class ServiceConfigDto {
  @IsInt()
  readonly serviceId: number;

  @IsObject()
  readonly config: JSON;
}
