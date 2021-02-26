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
    type: 'json',
    nullable: true,
  })
  extra: JSON;

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

  // @Column({
  //   type: 'datetime',
  //   name: 'create_time',
  //   default: () => 'NOW()',
  // })
  // createTime: Date;

  // @Column({
  //   type: 'datetime',
  //   name: 'update_time',
  //   default: () => 'NOW()',
  // })
  // updateTime: Date;

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

  @Column({
    type: 'tinyint',
    name: 'is_delete',
    default: 0,
  })
  isDelete: number;
}
