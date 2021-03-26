import { IsNotEmpty, IsInt, IsPositive, ArrayNotEmpty } from 'class-validator';

/**
 * URL参数ID校验
 */
export class ParamIdDto {
  @IsNotEmpty()
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
