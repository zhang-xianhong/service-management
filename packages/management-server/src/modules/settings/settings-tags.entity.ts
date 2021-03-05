/**
 * 标签表
 */
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

// settings/tags/
@Entity({ name: 'settings_tag' })
export class SettingsTagsEntity extends BaseEntity {
  // 名称
  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'varchar',
    default: '',
  })
  description: string;

  // 克隆源
  @Column({
    type: 'varchar',
    name: 'clone_by',
    default: '',
    comment: '克隆来源',
  })
  cloneBy: string;
}
