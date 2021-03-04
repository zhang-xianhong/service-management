import { BeforeUpdate, Column, PrimaryColumn } from 'typeorm';

export class BaseEntity {
  // 自增ID
  @PrimaryColumn({
    type: 'bigint',
    generated: true,
  })
  id: number;

  // 创建时间
  @Column({
    type: 'timestamp',
    name: 'create_time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  // 修改时间
  @Column({
    type: 'timestamp',
    name: 'update_time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  // 创建人
  @Column({
    type: 'bigint',
    name: 'create_user',
    default: null,
  })
  createUser: number;

  // 更新人
  @Column({
    type: 'bigint',
    name: 'update_user',
    default: null,
  })
  updateUser: number;

  // 是否删除
  @Column({
    name: 'is_delete',
    type: 'boolean',
    width: 1,
    default: false,
    select: false,
  })
  isDelete: boolean;

  @BeforeUpdate()
  updateFields() {
    console.log(0, this);
  }
}
