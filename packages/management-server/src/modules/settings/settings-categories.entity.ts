/**
 * 分类表
 */
import { Column, Entity, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BaseEntity } from '../base.entity';

// settings/tags/
@Entity({ name: 'settings_category' })
@Tree('materialized-path')
export class SettingsCategoriesEntity extends BaseEntity {
  // 名称
  @Column({
    type: 'varchar',
    default: '',
  })
  name: string;
  // 描述
  @Column({
    type: 'varchar',
    default: '',
  })
  description: string;
  @TreeChildren()
  children?: SettingsCategoriesEntity[];
  @TreeParent()
  parent?: SettingsCategoriesEntity;
}
