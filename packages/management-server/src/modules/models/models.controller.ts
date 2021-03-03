import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiException } from 'src/shared/utils/api.exception';
import { is, isEmpty } from '../../shared/utils/validator';
import { CommonCodes } from '../../shared/constants/code';
import { ModelsService } from './models.service';
import { QueryPipe, SearchQuery } from '../../shared/pipes/query.pipe';
import { REG_UPPER_CAMEL_CASE, REG_LOWER_CAMEL_CASE } from '../../shared/utils/rules';
// import { ModelInfoDto } from './model-info.dto';
@Controller('models')

export class ModelsController {
  constructor(private readonly modelService: ModelsService) {}

  /**
   * 获取分页的模型列表
   * @param query
   */
  @Get()
  async findAll(@Query(new QueryPipe()) query: SearchQuery) {
    if (query.keyword) {
      // 处理 search
    }
    const [list, total] = await this.modelService.findAll({
      ...query.conditions,
    });
    return {
      total,
      list,
    };
  }

  /**
   * 获取全部模型列表
   * @param query
   */
  @Get('all')
  async findAllWithoutPagination(@Query() query) {
    if (query.keyword) {
      // 处理 search
    }
    const list = await this.modelService.findAll({}, false);
    return list;
  }

  /**
   * 获取model详情
   * @param param0
   */
  @Get(':id')
  async findOneById(@Param() { id }) {
    const res = await this.modelService.findById(Number(id));
    return res;
  }


  /**
   * 创建一个模型
   * @param postData
   */
  @Post()
  async create(@Body() postData) {
    this.validatePostData(postData);
    const { name, description, owner, isAllByExtend, modelRank, classification, tags, fields } = postData;
    return await this.modelService.create({
      name,
      description,
      owner,
      isAllByExtend,
      modelRank,
      classification,
      tags,
      fields,
    });
  }

  /**
   * 更新模型
   * @param postData
   */
  @Post(':id')
  async updateModel(@Body() postData, @Param() { id }) {
    this.validatePostData(postData);
    const { name, description, owner = '', isAllByExtend = false, modelRank = '', classification = '', tags = '', fields } = postData;
    return await this.modelService.updateModel(id, {
      name,
      description,
      owner,
      isAllByExtend,
      modelRank,
      classification,
      tags,
      fields,
    });
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
        || isEmpty(field.type)
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
}
