import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ModelsInfoEntity } from './models-info.entity';

@Entity({ name: 'model-fields' })
export class ModelsFieldsEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({ length: 64 })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  type: string;

  @Column({
    type: 'tinytext',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'int',
    default: 0,
  })
  order: number;

  @ManyToOne(() => ModelsInfoEntity, model => model.id)
  @JoinColumn({
    name: 'model_id',
  })
  modelId: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  extra: string;

  @Column({
    type: 'varchar',
    name: 'foreign_id',
    nullable: true,
  })
  foreignId: string;

  @Column({
    type: 'int',
    default: 0,
  })
  version: number;

  @Column({
    name: 'is_system',
    type: 'bool',
    default: false,
  })
  isSystem: boolean;

  @Column({
    name: 'not_null',
    type: 'bool',
    default: false,
  })
  notNull: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  unique: boolean;

  @Column({
    type: 'bool',
    default: false,
  })
  index: boolean;

  @Column({
    type: 'bool',
    default: false,
  })
  participle: boolean;


  @Column({
    type: 'bool',
    default: false,
  })
  pinyin: boolean;


  @Column({
    type: 'datetime',
    name: 'create_time',
    default: () => 'NOW()',
  })
  createTime: Date;

  @Column({
    type: 'datetime',
    name: 'update_time',
    default: () => 'NOW()',
  })
  updateTime: Date;

  @Column({
    type: 'bigint',
    name: 'create_user',
    nullable: true,
  })
  createUser: number;

  @Column({
    type: 'bigint',
    name: 'update_user',
    nullable: true,
  })
  updateUser: number;
}
