import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { ModelsFieldsEntity } from './models-fields.entity';

@Entity({ name: 'model_info' })
export class ModelsInfoEntity extends BaseEntity {
  @Column({ length: 64 })
  name: string;

  @Column({
    type: 'tinytext',
  })
  description: string;

  // 建表引擎
  @Column({
    type: 'varchar',
    default: 'innoDB',
  })
  engine: string;

  // 版本
  @Column({
    type: 'int',
    default: 0,
  })
  version: number;

  // 负责人
  @Column({
    type: 'varchar',
    default: '',
  })
  owner: string;

  // 是否纯继承
  @Column({
    name: 'is_all_by_extend',
    width: 1,
    type: 'boolean',
    comment: '是否纯继承',
    default: false,
  })
  isAllByExtend: boolean;

  // 对象级别
  @Column({
    name: 'model_rank',
    type: 'varchar',
    default: '',
    comment: '对象级别',
  })
  modelRank: string;

  // 分类
  @Column({
    type: 'varchar',
    default: '',
  })
  classification: string;

  // 标签
  @Column({
    type: 'varchar',
    default: '',
  })
  tags: string;

  // 相似对象
  @Column({
    name: 'similar_object',
    type: 'varchar',
    default: '',
    comment: '相似对象',
  })
  similarObject: string;

  // 相似度
  @Column({
    type: 'float',
    default: null,
  })
  similarity: number;

  // 克隆源
  @Column({
    name: 'clone_by',
    type: 'varchar',
    default: '',
  })
  cloneBy: string;

  // 启动时间
  @Column({
    type: 'datetime',
    name: 'start_time',
    default: null,
    comment: '启动时间',
  })
  startTime: number;

  @OneToMany(() => ModelsFieldsEntity, field => field.modelId)
  fields: ModelsFieldsEntity;
}
