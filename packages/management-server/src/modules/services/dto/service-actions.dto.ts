import { IsNotEmpty } from 'class-validator';


export class ServiceIdDto {
  @IsNotEmpty()
  serviceId: number;
}

export class ServiceBuildDto {
  @IsNotEmpty()
  serviceId: number;

  @IsNotEmpty()
  branch: string;

  @IsNotEmpty()
  userId: number;
}
