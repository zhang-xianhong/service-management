import { IsArray, IsNotEmpty, IsNumber,  ValidateNested } from 'class-validator';

export class MemberDto {
  @IsNotEmpty()
  @IsNumber()
  projectRoleId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}

// 深度校验
export class MembersDto {
  // @ValidateNested({ each: true })
  @IsArray()
  members?: number[];

  @IsNotEmpty()
  @IsNumber()
  projectRoleId: number;
}
