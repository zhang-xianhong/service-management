import { IsNotEmpty, IsNumber } from 'class-validator';
import { DeletedIdsDto } from 'src/modules/base.dto';

export class MemberDeleteDto extends DeletedIdsDto {
  @IsNotEmpty()
  @IsNumber()
  projectRoleId: number;
}

