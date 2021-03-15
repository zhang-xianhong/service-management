/**
 * 用户控制页面中表格，单元格的显示排序等操作
 */
import { Table, Column, DataType, Length  } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';

@Table({
  timestamps: false,
  tableName: 'settings_column',
})

// settings/columns/work
export class ColumnsEntity extends BaseModel<ColumnsEntity> {
  // 所属表模块
  @Length({ min: 1, max: 64 })
  @Column({
    type: DataType.STRING,
  })
  module: string;

  @Column({
    type: DataType.STRING,
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
    type: DataType.JSON,
  })
  columns: JSON;
}
