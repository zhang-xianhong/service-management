import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ModelFieldsEntity } from './model-fields.entity';

@Entity({ name: 'model-info' })
export class ModelInfoEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({ length: 64 })
  name: string;

  @Column({
    type: 'tinytext',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'varchar',
    default: 'innoDB',
    nullable: true,
  })
  engine: string;

  @Column({
    type: 'int',
    nullable: true,
    default: 0,
  })
  version: number;

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

  @Column({
    type: 'tinyint',
    name: 'is_delete',
    default: 0,
  })
  isDelete: number;

  @OneToMany(() => ModelFieldsEntity, field => field.modelId)
  fields: ModelFieldsEntity;
}
