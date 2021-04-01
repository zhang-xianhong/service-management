import { IsNotEmpty } from 'class-validator';


export class ServiceIdDto {
  @IsNotEmpty()
  serviceId: number;
}

export class ServiceStartDto {
  @IsNotEmpty()
  serviceId: number;

  @IsNotEmpty()
  branch: string;

  @IsNotEmpty()
  userId: number;
}
