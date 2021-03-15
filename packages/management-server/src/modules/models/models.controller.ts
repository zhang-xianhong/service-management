import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiException } from 'src/shared/utils/api.exception';
import { is, isEmpty, isNumeric } from '../../shared/utils/validator';
import { CommonCodes } from '../../shared/constants/code';
import { ModelsService } from './models.service';
import { QueryPipe, SearchQuery } from '../../shared/pipes/query.pipe';
import { REG_UPPER_CAMEL_CASE, REG_LOWER_CAMEL_CASE } from '../../shared/utils/rules';
@Controller('models')

export class ModelsController {
  constructor(private readonly modelService: ModelsService) {}

  /**
   * 获取分页的模型列表
   * @param query
   */
  @Get()
  async findAll(@Query(new QueryPipe()) query: SearchQuery) {
    return  await this.modelService.findAll(query);
  }

  /**
   * 获取全部模型列表
   */
  @Get('all')
  async findAllWithoutPagination(@Query(new QueryPipe()) query: SearchQuery) {
    return await this.modelService.findAll({
      getFields: Number(query.fields) === 1,
    }, false);
  }

  /**
   * 获取model详情
   * @param param0
   */
  @Get(':id')
  async findOneById(@Param() { id }) {
    return await this.modelService.findById(Number(id));
  }


  /**
   * 创建一个模型
   * @param postData
   */
  @Post()
  async create(@Body() postData) {
    this.validatePostData(postData);
    // return await this.modelService.create(this.getPostData(postData));
  }

  /**
    * 批量删除模型
    * @param param0
    */
  @Post('/delete')
  async deleteModels(@Body() { ids = [] }) {
    const deleteIds = ids.filter(id => isNumeric(id));
    if (!deleteIds.length) {
      throw new ApiException({
        code: CommonCodes.DELETED_FAIL,
        message: '无效的ID',
      });
    }
    // return await this.modelService.deleteModel(deleteIds);
  }

  /**
   * 更新模型
   * @param postData
   */
  @Post(':id')
  async updateModel(@Body() postData, @Param() { id }) {
    this.validatePostData(postData);
    // return await this.modelService.updateModel(id, this.getPostData(postData));
  }

  /**
   * 暂时先用这个去校验参数
   * @param data
   */
  private validatePostData(data) {
    const { name, description, fields } = data;
    if (isEmpty(name) || !is(name, REG_UPPER_CAMEL_CASE)) {
      throw new ApiException({
        code: CommonCodes.PARAMETER_INVALID,
        message: '无效的模型名称',
      });
    }

    if (isEmpty(description)) {
      throw new ApiException({
        code: CommonCodes.PARAMETER_INVALID,
        message: '无效的模型描述',
      });
    }

    if (fields && Array.isArray(fields) && fields.length > 0) {
      const names = [];
      const isInvalid = fields.some((field) => {
        if (isEmpty(field.name)
        || isEmpty(field.description)
        || isEmpty(field.typeId)
        || !is(field.name, REG_LOWER_CAMEL_CASE)) {
          return true;
        }
        if (!names.includes(field.name)) {
          names.push(field.name);
        }
        return false;
      });
      if (isInvalid) {
        throw new ApiException({
          code: CommonCodes.PARAMETER_INVALID,
          message: '字段参数无效',
        });
      }
      if (names.length !== fields.length) {
        throw new ApiException({
          code: CommonCodes.PARAMETER_INVALID,
          message: '存在重复的字段名',
        });
      }
    } else {
      throw new ApiException({
        code: CommonCodes.PARAMETER_INVALID,
        message: 'fields字段不能为空',
      });
    }
  }


  /**
   * 获取存储数据
   * @param postData
   */
  private getPostData(postData) {
    const {
      name,
      description,
      fields,
      remark = '',
      owner  = '',
      isAllByExtend = false,
      modelRank = '',
      classification = '',
      tags = '',
    } = postData;
    return {
      name,
      description,
      remark,
      owner,
      isAllByExtend,
      modelRank,
      classification,
      tags,
      fields,
    };
  }
}
