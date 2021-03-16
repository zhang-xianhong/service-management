/**
 * 分类表
 */
import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany  } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';

@Table({
  timestamps: false,
  tableName: 'settings_category',
})

// settings/tags/
export class SettingsCategoriesModel extends BaseModel {
  // 名称
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  name: string;
  // 描述
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  description: string;

  // 隶属服务
  @ForeignKey(() => SettingsCategoriesModel)
  @Column({
    type: DataType.BIGINT,
    field: 'parent_id',
  })
  parentId: number;

  @BelongsTo(() => SettingsCategoriesModel)
  parent: SettingsCategoriesModel;

  @HasMany(() => SettingsCategoriesModel)
  children: SettingsCategoriesModel[];
}
