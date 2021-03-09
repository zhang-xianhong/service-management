/**
 * 标签表
 */
import { Column, Entity, ManyToOne, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BaseEntity } from '../base.entity';

// settings/tags/
@Entity({ name: 'settings_category' })
@Tree('materialized-path')
export class SettingsCategoryEntity extends BaseEntity {
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

  // @ManyToOne(() => SettingsCategoryEntity, category => category.children)
  // parent: SettingsCategoryEntity;

  // @OneToMany(() => SettingsCategoryEntity, category => category.parent)
  // children: SettingsCategoryEntity[];
  // @TreeChildren()
  // children: SettingsCategoryEntity[];
  // @TreeParent()
  // parent: SettingsCategoryEntity;
  @TreeChildren()
  children: SettingsCategoryEntity[];
  @TreeParent()
  parent: SettingsCategoryEntity;
}
