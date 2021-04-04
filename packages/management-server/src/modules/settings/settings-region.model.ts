/**
 * 行政区划表
 */
import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany, PrimaryKey, Model  } from 'sequelize-typescript';

@Table({
  timestamps: false,
  tableName: 'settings_region',
})

export class SettingsRegionModel extends Model {
  // 行政区划代码
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    unique: true,
  })
  code: number;

  // 地区名称
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  name: string;

  // 地区级别：1.省 2.市 3.区(县)
  @Column({
    type: DataType.TINYINT,
    comment: '地区级别：1.省 2.市 3.区(县)',
    defaultValue: 1,
  })
  level: number;

  // 上级行政区划代码
  @ForeignKey(() => SettingsRegionModel)
  @Column({
    type: DataType.BIGINT,
    field: 'parent_id',
    comment: '上级行政区划代码',
    defaultValue: null,
  })
  parentId: number;

  @BelongsTo(() => SettingsRegionModel, 'code')
  parent: SettingsRegionModel;

  @HasMany(() => SettingsRegionModel, 'code')
  children: SettingsRegionModel[];
}
