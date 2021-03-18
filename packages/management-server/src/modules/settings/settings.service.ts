import { HttpStatus, Injectable } from '@nestjs/common';
import { DataTypesModel } from './settings-data-types.model';
import { SettingsTagsModel } from './settings-tags.model';
import { PlainObject, SearchQuery } from 'src/shared/pipes/query.pipe';
import { ApiException } from 'src/shared/utils/api.exception';
import { CommonCodes, SettingCodes } from 'src/shared/constants/code';
import { SettingsCategoriesModel } from './settings-categories.model';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { isDefined } from 'src/shared/utils/validator';
import { ErrorTypes } from 'src/shared/constants/error';
import { getTreeArr } from 'src/shared/utils/util';
import { SettingsDataTypeDto } from './dto/settings-data-type.dto';
import { SettingsTagDto } from './dto/settings-tag.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(DataTypesModel) private readonly dataTypesRepository: typeof DataTypesModel,
    @InjectModel(SettingsTagsModel) private readonly tagsRepository: typeof SettingsTagsModel,
    @InjectModel(SettingsCategoriesModel) private readonly categoriesRepository: typeof SettingsCategoriesModel,
    // private connection: Connection,
  ) { }

  /**
   * 获取数据类型列表
   * @param query
   * @param getTotal
   * @returns
   */
  async findAllDataTypes(query: SearchQuery, getTotal = true) {
    const where = {
      isDelete: false,
    };
    if (query.keyword) {
      where[Op.or] = [
        {
          name: {
            [Op.like]: `%${query.keyword}%`,
          },
        },
        {
          description: {
            [Op.like]: `%${query.keyword}%`,
          },
        },
      ];
    }
    if (isDefined(query.isSystem)) {
      (where as PlainObject).isSystem = query.isSystem;
    }
    const { conditions } = query;
    conditions.where = where;
    if (!getTotal) {
      // 删除分页相关的字段
      delete conditions.offset;
      delete conditions.limit;
      return await this.dataTypesRepository.findAll(conditions);
    }
    return await this.dataTypesRepository.findAndCountAll(conditions);
  }

  /**
   * 通过ID查找数据类型
   * @param id
   * @returns
   */
  async findDataTypeById(id: number) {
    const row = await this.dataTypesRepository.findOne({
      where: {
        id,
        isDelete: false,
      },
    });
    if (!row) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '数据类型不存在',
        error: ErrorTypes.NOT_FOUND,
      });
    }
    return row;
  }


  /**
   * 创建数据类型
   * @param postData
   * @returns
   */
  async createDataType(postData: SettingsDataTypeDto) {
    const nameExisted = await this.dataTypesRepository.findOne({
      where: {
        isDelete: false,
        name: postData.name,
      },
    });
    if (nameExisted) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: `名称[${postData.name}]已存在`,
      });
    }
    const res = await this.dataTypesRepository.create(postData);
    return {
      dataTypeId: res.id,
    };
  }


  /**
   * 更新数据类型
   * @param postData
   * @returns
   */
  async updateDataType(id: number, postData: SettingsDataTypeDto) {
    const row = await this.findDataTypeById(id);
    if (row.isSystem) {
      throw new ApiException({
        code: CommonCodes.PARAMETER_INVALID,
        message: '内置类型禁止更新',
      });
    }
    const nameExisted = await this.dataTypesRepository.findOne({
      where: {
        isDelete: false,
        name: postData.name,
        id: {
          [Op.not]: id,
        },
      },
    });
    if (nameExisted) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: `名称[${postData.name}]已存在`,
      });
    }
    await this.dataTypesRepository.update(postData, {
      where: { id },
    });
    return {
      dataTypeId: id,
    };
  }

  /**
   * 删除数据类型（支持批量）
   * @param ids
   */
  async deleteDataTypes(ids: Array<number>) {
    const [deleted] = await this.dataTypesRepository.update({
      isDelete: true,
    }, {
      where: {
        id: {
          [Op.in]: ids,
        },
        isSystem: false,
      },
    });
    if (deleted === ids.length) {
      return {
        deleted: ids,
      };
    }
    throw new ApiException({
      code: CommonCodes.DELETED_FAIL,
      message: '部分删除失败(可能原因：已被删除或者系统类型不允许删除)',
    });
  }


  /**
   * 获取全部
   * @param query
   * @param getTotal
   */
  async findAllTags(query, getTotal = true) {
    const where = {
      isDelete: false,
    };
    if (query.keyword) {
      where[Op.or] = [
        {
          name: {
            [Op.like]: `%${query.keyword}%`,
          },
        },
        {
          description: {
            [Op.like]: `%${query.keyword}%`,
          },
        },
      ];
    }
    const { conditions } = query;
    conditions.where = where;
    if (!getTotal) {
      // 删除分页相关的字段
      delete conditions.offset;
      delete conditions.limit;
      return await this.tagsRepository.findAll(conditions);
    }
    return await this.tagsRepository.findAndCountAll(conditions);
  }

  /**
   * 创建标签
   * @param postData
   */
  async createTag(postData: SettingsTagDto) {
    const nameExisted = await this.tagsRepository.findOne({
      where: {
        name: postData.name,
        isDelete: false,
      },
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
   * 通过ID查找标签
   * @param id
   * @returns
   */
  async findTagById(id: number) {
    const row = await this.tagsRepository.findOne({
      where: {
        id,
        isDelete: false,
      },
    });
    if (!row) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '标签不存在',
        error: ErrorTypes.NOT_FOUND,
      });
    }
    return row;
  }

  /**
   * 更新标签
   * @param postData
   * @returns
   */
  async updateTag(id: number, postData: SettingsTagDto) {
    await this.findTagById(id);
    const nameExisted = await this.tagsRepository.findOne({
      where: {
        isDelete: false,
        name: postData.name,
        id: {
          [Op.not]: id,
        },
      },
    });
    if (nameExisted) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: `名称[${postData.name}]已存在`,
      });
    }
    await this.tagsRepository.update(postData, {
      where: { id },
    });
    return {
      tagId: id,
    };
  }

  /**
   * 删除标签（支持批量）
   * @param ids
   */
  async deleteTags(ids: Array<number>) {
    const [deleted] = await this.tagsRepository.update({
      isDelete: true,
    }, {
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    if (deleted === ids.length) {
      return {
        deleted: ids,
      };
    }
    throw new ApiException({
      code: CommonCodes.DELETED_FAIL,
      message: '删除失败',
    });
  }


  /**
   * 获取所有分类
   * @param query
   * @param getTotal
   */
  async findAllCategories(): Promise<SettingsCategoriesModel[]>  {
    return await this.categoriesRepository.findAll({
      where: { isDelete: false },
    });
  }

  /**
   * 获取分类详情
   * @param query
   * @param getTotal
   */
  async findCategoryById(id: number): Promise<SettingsCategoriesModel> {
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
  async findCategoriesTree(): Promise<Object[]> {
    const categories = await this.categoriesRepository.findAll({
      raw: true,
    });
    const categoriesTree = getTreeArr({ key: 'id', pKey: 'parentId', data: categories });
    return categoriesTree;
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
        }, HttpStatus.NOT_FOUND);
      }
      category.parentId = parentId;
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
      }, HttpStatus.NOT_FOUND);
    }
    return await this.categoriesRepository.update(data, {
      where: { id },
    });
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
    const data = await this.categoriesRepository.findAll({
      where: {
        parentId: id,
        isDelete: false,
      },
      raw: true,
    });
    if (data.length) {
      throw new ApiException({
        code: SettingCodes.EXIST_CHILD_NODES,
        message: '分类存在子节点，请先删除子节点',
      });
    }
    await this.categoriesRepository.update({
      isDelete: true,
    }, {
      where: { id },
    });
    return {
      categoryId: id,
    };
  }
}
