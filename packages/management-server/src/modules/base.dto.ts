import { IsNotEmpty, IsInt,  Min, IsPositive, ArrayNotEmpty } from 'class-validator';

/**
 * URL参数ID校验
 */
export class ParamIdDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Min(1)
  id: number;
}

/**
 * 删除Body参数校验
 */
export class DeletedIdsDto {
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @ArrayNotEmpty()
  ids: number[];
}
