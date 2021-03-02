/**
 * 用户控制页面中表格，单元格的显示排序等操作
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// settings/columns/work
@Entity({ name: 'settings_columns' })
export class ColumnsEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  // 所属表模块
  @Column({ length: 64 })
  module: string;

  @Column({
    type: 'tinytext',
  })
  description: string;

  /**
   * 显示字段
   * [{
   *  field: 字段名,
   *  display: true | false,
   *  group: 分组,
   *  order: 排序
   * }]
   */
  @Column({
    type: 'json',
    name: 'columns',
  })
  columns: JSON;

  @Column({
    type: 'datetime',
    name: 'update_time',
    default: () => 'NOW()',
  })
  updateTime: Date;

  @Column({
    type: 'bigint',
    name: 'update_user',
    default: null,
  })
  createUser: number;
}
