import { HttpStatus, Injectable } from '@nestjs/common';
import { DataTypesEntity } from './settings-data-types.entity';
import { SettingsTagsEntity } from './settings-tags.entity';
import { PlainObject } from 'src/shared/pipes/query.pipe';
import { ApiException } from 'src/shared/utils/api.exception';
import { CommonCodes } from 'src/shared/constants/code';
import { SettingsCategoriesEntity } from './settings-categories.entity';
import { SYSTEM_FIELD_TYPES } from 'src/shared/constants/field-types';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(DataTypesEntity) private readonly dataTypesRepository: typeof DataTypesEntity,
    @InjectModel(SettingsTagsEntity) private readonly tagsRepository: typeof SettingsTagsEntity,
    @InjectModel(SettingsCategoriesEntity) private readonly categoriesRepository: typeof SettingsCategoriesEntity,
    // private connection: Connection,
  ) { }

  /**
   * 获取数据类型列表
   * @returns
   */
  async findDataTypes() {
    const types = await this.dataTypesRepository.findAll({
      where: { isDelete: false },
    });
    return [...SYSTEM_FIELD_TYPES, ...types];
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
      // where.name = ILike(`%${query.keyword}%`);
    }
    if (!getTotal) {
      return await this.tagsRepository.findAll(where);
    }
    const { conditions } = query;
    conditions.where = where;
    return await this.tagsRepository.findAndCountAll(conditions);
  }

  /**
   * 创建标签
   * @param postData
   */
  async createTag(postData) {
    const nameExisted = await this.tagsRepository.findOne({
      where: {
        // name: postData.name as string,
        isDelete: false },
    });
    if (nameExisted) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: '标签名称已存在',
      });
    }
    const res = await this.tagsRepository.create(postData);
    return {
      tagId: res.id,
    };
  }

  /**
   * 获取所有分类
   * @param query
   * @param getTotal
   */
  async findAllCategories() {
    return await this.categoriesRepository.findAll({
      where: { isDelete: false },
    });
  }

  /**
   * 获取分类详情
   * @param query
   * @param getTotal
   */
  async findCategoryById(id: number) {
    return await this.categoriesRepository.findOne({
      where: {
        id,
        isDelete: false,
      },
    });
  }

  /**
   * 获取分类树
   * @param query
   * @param getTotal
   */
  async findCategoriesTree() {
    // return await this.categoriesRepository.findTrees();
  }

  /**
   * 新增分类
   * @param data
   */
  async createCategory(data: any) {
    const { parentId, ...category } = data;
    if (parentId) {
      const parent = await this.categoriesRepository.findOne({ where: { id: parentId } });
      if (!parent) {
        throw new ApiException({
          code: CommonCodes.NOT_FOUND,
          message: '父级分类不存在',
          // error: ErrorTypes.NOT_FOUND,
        }, HttpStatus.NOT_FOUND);
      }
      category.parent = parent;
    }
    const result = await this.categoriesRepository.create(category);
    return {
      categoryId: result.id,
    };
  }

  /**
   * 更新分类
   * @param data
   */
  async updateCategory(id: number, data: any) {
    const category = await this.categoriesRepository.findOne({
      where: {
        isDelete: false,
        id,
      },
    });
    if (!category) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '分类不存在',
        // error: ErrorTypes.NOT_FOUND,
      }, HttpStatus.NOT_FOUND);
    }
    return await this.categoriesRepository.update({ id }, data);
  }

  /**
   * 删除分类
   * @param data
   */
  async deleteCategory(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: {
        isDelete: false,
        id,
      },
    });
    if (!category) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '分类不存在',
        // error: ErrorTypes.NOT_FOUND,
      }, HttpStatus.NOT_FOUND);
    }
    // const data = await this.categoriesRepository.findDescendantsTree(category);
    // if (data.children.length) {
    //   throw new ApiException({
    //     code: SettingCodes.EXIST_CHILD_NODES,
    //     message: '存在子节点',
    //   });
    // }
    return  await this.categoriesRepository.destroy({ where: { id } });
  }
}
