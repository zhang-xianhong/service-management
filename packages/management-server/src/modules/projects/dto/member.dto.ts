import { IsNotEmpty, IsNumber } from 'class-validator';

export class MemberDto {
  @IsNotEmpty()
  @IsNumber()
  projectRoleId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}

