import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository, Connection, ILike, TreeRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataTypesEntity } from './settings-data-types.entity';
import { SettingsTagsEntity } from './settings-tags.entity';
import { PlainObject } from 'src/shared/pipes/query.pipe';
import { ApiException } from 'src/shared/utils/api.exception';
import { CommonCodes, SettingCodes } from 'src/shared/constants/code';
import { SettingsCategoriesEntity } from './settings-categories.entity';
import { ErrorTypes } from 'src/shared/constants/error';

@Injectable()
export class SettingsService {
  constructor(
    private connection: Connection,
    @InjectRepository(DataTypesEntity)
    private readonly dataTypesRepository: Repository<DataTypesEntity>,
    @InjectRepository(SettingsTagsEntity)
    private readonly tagsRepository: Repository<SettingsTagsEntity>,
    @InjectRepository(SettingsCategoriesEntity)
    private readonly categoriesRepository: TreeRepository<SettingsCategoriesEntity>,
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
  async findAllCategories() {
    return await this.categoriesRepository.find({
      isDelete: false,
    });
  }

  /**
   * 获取分类详情
   * @param query
   * @param getTotal
   */
  async findCategoryById(id: number) {
    return await this.categoriesRepository.findOne({
      isDelete: false,
      id,
    });
  }

  /**
   * 获取分类树
   * @param query
   * @param getTotal
   */
  async findCategoriesTree() {
    return await this.categoriesRepository.findTrees();
  }

  /**
   * 新增分类
   * @param data
   */
  async createCategory(data: any) {
    const { parentId, ...category } = data;
    if (parentId) {
      const parent = await this.categoriesRepository.findOne({ id: parentId });
      if (!parent) {
        throw new ApiException({
          code: CommonCodes.NOT_FOUND,
          message: '父级分类不存在',
          error: ErrorTypes.NOT_FOUND,
        }, HttpStatus.NOT_FOUND);
      }
      category.parent = parent;
    }
    const result = await this.categoriesRepository.save(category);
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
        error: ErrorTypes.NOT_FOUND,
      }, HttpStatus.NOT_FOUND);
    }
    const result = await this.categoriesRepository.update(id, data);
    return result.affected === 1;
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
        error: ErrorTypes.NOT_FOUND,
      }, HttpStatus.NOT_FOUND);
    }
    const data = await this.categoriesRepository.findDescendantsTree(category);
    if (data.children.length) {
      throw new ApiException({
        code: SettingCodes.EXIST_CHILD_NODES,
        message: '存在子节点',
      });
    }
    const result = await this.categoriesRepository.delete(id);
    return result.affected === 1;
  }
}
