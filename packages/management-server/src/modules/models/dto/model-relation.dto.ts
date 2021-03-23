import { IsNotEmpty } from 'class-validator';
import { MODEL_RELATION_TYPES } from 'src/shared/constants/model-relation-types';

/**
 * 模型关系
 */
export class ModelRelationDto {
  @IsNotEmpty()
  serviceId: number;
  @IsNotEmpty()
  fromModelId: number;
  @IsNotEmpty()
  toModelId: number;
  @IsNotEmpty()
  relationType: MODEL_RELATION_TYPES;
}
