import { IsNotEmpty, IsInt, IsPositive, ArrayNotEmpty, IsOptional } from 'class-validator';

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

/**
 * 校验名称唯一性
 */
export class NameUsableDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsInt()
  id: number;
}
