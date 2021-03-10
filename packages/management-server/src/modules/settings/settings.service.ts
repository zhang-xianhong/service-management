import { Injectable } from '@nestjs/common';
import { Repository, Connection, ILike, TreeRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataTypesEntity } from './settings-data-types.entity';
import { SettingsTagsEntity } from './settings-tags.entity';
import { PlainObject } from 'src/shared/pipes/query.pipe';
import { ApiException } from 'src/shared/utils/api.exception';
import { CommonCodes, SettingCodes } from 'src/shared/constants/code';
import { SettingsCategoryEntity } from './settings-category.entity';

@Injectable()
export class SettingsService {
  constructor(
    private connection: Connection,
    @InjectRepository(DataTypesEntity)
    private readonly dataTypesRepository: Repository<DataTypesEntity>,
    @InjectRepository(SettingsTagsEntity)
    private readonly tagsRepository: Repository<SettingsTagsEntity>,
    @InjectRepository(SettingsCategoryEntity)
    private readonly categoryRepository: TreeRepository<SettingsCategoryEntity>,
  ) {}

  async findDataTypes() {
    return (await this.dataTypesRepository.find({
      isDelete: false,
    }));
  }

  /**
   * 获取全部
   * @param query
   * @param getTotal
   */
  async findAllTags(query, getTotal = true) {
    const where: PlainObject = {
      isDelete: false,
    };
    if (query.keyword) {
      where.name = ILike(`%${query.keyword}%`);
    }
    if (!getTotal) {
      return await this.tagsRepository.find(where);
    }
    const { conditions } = query;
    conditions.where = where;
    return await this.tagsRepository.findAndCount(conditions);
  }

  /**
   * 创建标签
   * @param postData
   */
  async createTag(postData) {
    const nameExisted = await this.tagsRepository.findOne({
      name: postData.name,
      isDelete: false,
    });
    if (nameExisted) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: '标签名称已存在',
      });
    }
    const res = await this.tagsRepository.save(postData);
    return {
      tagId: res.id,
    };
  }

  /**
   * 获取所有分类
   * @param query
   * @param getTotal
   */
  async findAllCategorys() {
    return await this.categoryRepository.find({
      isDelete: false,
    });
  }

  /**
   * 获取分类详情
   * @param query
   * @param getTotal
   */
  async findCategorysById(id: number) {
    return await this.categoryRepository.findOne({
      isDelete: false,
      id,
    });
  }

  /**
   * 获取分类树
   * @param query
   * @param getTotal
   */
  async findCategorysTree() {
    return await this.categoryRepository.findTrees();
  }

  /**
   * 新增分类
   * @param data
   */
  async createCategory(data: any) {
    const { parentId, ...category } = data;
    const parent = await this.categoryRepository.findOne({ id: data.parentId });
    category.parent = parent;
    const result = await this.categoryRepository.save(category);
    return {
      categoryId: result.id,
    };
  }

  /**
   * 更新分类
   * @param data
   */
  async updateCategory(id: number, data: any) {
    const category = await this.categoryRepository.findOne({
      where: {
        isDelete: false,
        id,
      },
    });
    if (!category) {
      throw new ApiException({
        code: SettingCodes.SETTING_ID_INVALID,
        message: '分类不存在',
      });
    }
    const result = await this.categoryRepository.update(id, data);
    return result.affected === 1;
  }

  /**
   * 删除分类
   * @param data
   */
  async deleteCategory(id: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        isDelete: false,
        id,
      },
    });
    if (!category) {
      throw new ApiException({
        code: SettingCodes.SETTING_ID_INVALID,
        message: '分类不存在',
      });
    }
    const data = await this.categoryRepository.findDescendantsTree(category);
    if (data.children.length) {
      throw new ApiException({
        code: SettingCodes.EXIST_CHILD_NODES,
        message: '存在子节点',
      });
    }
    const result = await this.categoryRepository.delete(id);
    return result.affected === 1;
  }
}
