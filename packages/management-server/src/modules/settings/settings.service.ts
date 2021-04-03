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
import { getDictionaryKey, getTreeArr } from 'src/shared/utils/util';
import { SettingsDataTypeDto } from './dto/settings-data-type.dto';
import { SettingsTagDto } from './dto/settings-tag.dto';
import { Created, Deleted, Details, Rows, RowsAndCount, Updated } from 'src/shared/types/response';
import { Tree } from 'src/shared/types/tree';
import { escapeLike } from 'src/shared/utils/sql';
import { SettingsDictionaryTypeModel } from './settings-dictionary-type.model';
import { SettingsDictionaryModel } from './settings-dictionary.model';
import { SettingsRegionModel } from './settings-region.model';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(DataTypesModel)
    private readonly dataTypesRepository: typeof DataTypesModel,
    @InjectModel(SettingsTagsModel)
    private readonly tagsRepository: typeof SettingsTagsModel,
    @InjectModel(SettingsCategoriesModel)
    private readonly categoriesRepository: typeof SettingsCategoriesModel,
    @InjectModel(SettingsDictionaryTypeModel)
    private readonly dictionaryTypeRepository: typeof SettingsDictionaryTypeModel,
    @InjectModel(SettingsDictionaryModel)
    private readonly dictionaryRepository: typeof SettingsDictionaryModel,
    @InjectModel(SettingsRegionModel)
    private readonly regionRepository: typeof SettingsRegionModel,
  ) { }

  /**
   * 获取数据类型列表
   * @param query
   * @param getTotal
   * @returns
   */
  async findAllDataTypes(query: SearchQuery, getTotal = true):
  Promise<Rows<DataTypesModel> | RowsAndCount<DataTypesModel>> {
    const where = {
      isDelete: false,
    };
    if (query.keyword) {
      const likeString = escapeLike(query.keyword);
      where[Op.or] = [
        {
          name: {
            [Op.like]: likeString,
          },
        },
        {
          description: {
            [Op.like]: likeString,
          },
        },
      ];
    }
    if (isDefined(query.isSystem)) {
      (where as PlainObject).isSystem = query.isSystem;
    }
    const { conditions = {} } = query as PlainObject;
    conditions.where = where;
    conditions.order = [['isSystem', 'DESC'], ['id', 'ASC']];
    conditions.attributes = { exclude: ['isDelete'] };
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
  async findDataTypeById(id: number): Promise<Details<DataTypesModel>> {
    const row: DataTypesModel = await this.dataTypesRepository.findOne({
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
  async createDataType(postData: SettingsDataTypeDto): Promise<Created> {
    const existDataType: DataTypesModel = await this.dataTypesRepository.findOne({
      where: {
        isDelete: false,
        name: postData.name,
      },
    });
    if (existDataType) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: `名称[${postData.name}]已存在`,
      });
    }
    const res: DataTypesModel = await this.dataTypesRepository.create(postData);
    return {
      id: res.id,
    };
  }


  /**
   * 更新数据类型
   * @param postData
   * @returns
   */
  async updateDataType(id: number, postData: SettingsDataTypeDto): Promise<Updated> {
    const row: DataTypesModel = await this.findDataTypeById(id);
    if (row.isSystem) {
      throw new ApiException({
        code: CommonCodes.PARAMETER_INVALID,
        message: '内置类型禁止更新',
      });
    }
    const existDataType: DataTypesModel = await this.dataTypesRepository.findOne({
      where: {
        isDelete: false,
        name: postData.name,
        id: {
          [Op.not]: id,
        },
      },
    });
    if (existDataType) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: `名称[${postData.name}]已存在`,
      });
    }
    await this.dataTypesRepository.update(postData, {
      where: { id },
    });
    return {
      id,
    };
  }

  /**
   * 删除数据类型（支持批量）
   * @param ids
   */
  async deleteDataTypes(ids: Array<number>): Promise<Deleted> {
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
        ids,
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
  async findAllTags(query, getTotal = true):
  Promise<Rows<SettingsTagsModel> | RowsAndCount<SettingsTagsModel>> {
    const where = {
      isDelete: false,
    };
    if (query.keyword) {
      const likeString = escapeLike(query.keyword);
      where[Op.or] = [
        {
          name: {
            [Op.like]: likeString,
          },
        },
        {
          description: {
            [Op.like]: likeString,
          },
        },
      ];
    }
    const { conditions = {} } = query;
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
  async createTag(postData: SettingsTagDto): Promise<Created> {
    const existTag: SettingsTagsModel = await this.tagsRepository.findOne({
      where: {
        name: postData.name,
        isDelete: false,
      },
    });
    if (existTag) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: '标签名称已存在',
      });
    }
    const res = await this.tagsRepository.create(postData);
    return {
      id: res.id,
    };
  }


  /**
   * 通过ID查找标签
   * @param id
   * @returns
   */
  async findTagById(id: number): Promise<Details<SettingsTagsModel>> {
    const row: SettingsTagsModel = await this.tagsRepository.findOne({
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
  async updateTag(id: number, postData: SettingsTagDto): Promise<Updated> {
    await this.findTagById(id);
    const existTag: SettingsTagsModel = await this.tagsRepository.findOne({
      where: {
        isDelete: false,
        name: postData.name,
        id: {
          [Op.not]: id,
        },
      },
    });
    if (existTag) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: `名称[${postData.name}]已存在`,
      });
    }
    await this.tagsRepository.update(postData, {
      where: { id },
    });
    return {
      id,
    };
  }

  /**
   * 删除标签（支持批量）
   * @param ids
   */
  async deleteTags(ids: Array<number>): Promise<Deleted> {
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
        ids,
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
  async findAllCategories(): Promise<Rows<SettingsCategoriesModel>> {
    return await this.categoriesRepository.findAll({
      where: { isDelete: false },
    });
  }

  /**
   * 获取分类详情
   * @param query
   * @param getTotal
   */
  async findCategoryById(id: number): Promise<Details<SettingsCategoriesModel>> {
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
  async findCategoriesTree(): Promise<Tree[]> {
    const categories: SettingsCategoriesModel[] = await this.categoriesRepository.findAll({
      raw: true,
    });
    return getTreeArr({ key: 'id', pKey: 'parentId', data: categories });
  }

  /**
   * 新增分类
   * @param data
   */
  async createCategory(data: any): Promise<Created> {
    const { parentId, ...category } = data;
    if (parentId) {
      const parent: SettingsCategoriesModel = await this.categoriesRepository.findOne({ where: { id: parentId } });
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
      id: result.id,
    };
  }

  /**
   * 更新分类
   * @param data
   */
  async updateCategory(id: number, data: any): Promise<Updated> {
    const category: SettingsCategoriesModel = await this.categoriesRepository.findOne({
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
    await this.categoriesRepository.update(data, {
      where: { id },
    });
    return {
      id,
    };
  }

  /**
   * 删除分类
   * @param data
   */
  async deleteCategory(id: number) {
    const category: SettingsCategoriesModel = await this.categoriesRepository.findOne({
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
    const data: SettingsCategoriesModel[] = await this.categoriesRepository.findAll({
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

  /**
   * 获取数据字典类型列表
   * @param query
   * @returns
   */
  async getDictionaryTypes(query) {
    const where: any = {
      isDelete: false,
      status: 0,
    };
    if (query.isLock) {
      where.isLock = query.isLock;
    }
    return await this.dictionaryTypeRepository.findAll({
      where,
    });
  }

  /**
   * 获取数据字典数据
   * @param typeKey
   * @returns
   */
  async findDictionaryInfo(typeKey: string) {
    const dictionary = await this.dictionaryTypeRepository.findOne({
      where: {
        typeKey,
        isDelete: false,
      },
      include: [{
        model: SettingsDictionaryModel,
        required: false,
        attributes: { exclude: ['isDelete'] },
      }],
    });
    if (!dictionary) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '数据不存在',
      }, HttpStatus.NOT_FOUND);
    }
    return dictionary;
  }

  /**
   * 新增数据字典类型
   * @param data
   */
  async addDictionaryType(data: any) {
    const res = await this.dictionaryTypeRepository.create(data);
    return {
      id: res.id,
    };
  }

  /**
   *新增数据字典数据
   * @param id
   * @param data
   */
  async addDictionaries(id: number, data: any) {
    const { typeKey } = await this.dictionaryTypeRepository.findOne({
      where: {
        id,
      },
    });
    if (!typeKey) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '数据不存在',
      }, HttpStatus.NOT_FOUND);
    }
    // 获取最大typeKey
    const [lastDictionary] = await this.dictionaryRepository.findAll({
      where: {
        typeId: id,
        isDelete: false,
      },
      order: [['id', 'DESC']],
    });
    const lastTypeKey =  lastDictionary ? lastDictionary.key : typeKey;


    const dictionaries = data.map((item, index) => ({
      ...item,
      typeId: id,
      key: getDictionaryKey(lastTypeKey, index),
    }));
    console.log(dictionaries);
    await this.dictionaryRepository.bulkCreate(dictionaries);
    return {
      ids: dictionaries.map(i => i.key),
    };
  }

  async getRegionTree(code = 0) {
    const regions: SettingsRegionModel[] = await this.regionRepository.findAll({
      where: {
        parentId: code,
      },
      raw: true,
    });
    return getTreeArr({ key: 'code', pKey: 'parentId', data: regions });
  }
  async getRegionListByLevel(level: number) {
    return await this.regionRepository.findAll({
      where: {
        level,
      },
      attributes: { exclude: ['parentId', 'level'] },
    });
  }
}
