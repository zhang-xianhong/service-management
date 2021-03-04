/**
 * 数据字典表
 */
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

// settings/dictionaries/:typeCode
@Entity({ name: 'settings_dictionary' })
export class DictionariesEntity extends BaseEntity {
  // 父级，为空则表示一级类型
  @Column({
    type: 'varchar',
    default: '',
  })
  parent: string;

  // 值
  @Column({
    type: 'varchar',
  })
  code: string;

  // 名称
  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'tinytext',
  })
  description: string;
}
