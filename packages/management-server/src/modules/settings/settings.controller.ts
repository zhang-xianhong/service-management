import { Body, Controller, Get, Param, Post, Query  } from '@nestjs/common';
import { CommonCodes } from 'src/shared/constants/code';
import { QueryPipe, SearchQuery } from 'src/shared/pipes/query.pipe';
import { ApiException } from 'src/shared/utils/api.exception';
import { isEmpty } from 'src/shared/utils/validator';
import { SettingsDataTypeDto } from './dto/settings-data-types.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  /* 数据类型相关 */
  // 获取数据类型(分页)
  @Get('/data-types')
  async getDataTypesByPaged(@Query(new QueryPipe()) query: SearchQuery) {
    return await this.service.findAllDataTypes(query);
  }

  // 获取数据类型(所有)
  @Get('/data-types/all')
  async getDataTypes(@Query(new QueryPipe()) query: SearchQuery) {
    return await this.service.findAllDataTypes(query, false);
  }

  // 获取数据类型详情
  @Get('/data-types/:id')
  async getDataTypeById() {
    // return await this.service.findAllDataTypes();
  }

  // 创建数据类型
  @Post('/data-types')
  async createDataType(@Body() postData: SettingsDataTypeDto) {
    return await this.service.createDataType(postData);
  }

  // 删除数据类型
  @Post('/data-types/delete')
  async deleteDataType() {
    // return await this.service.findAllDataTypes();
  }

  // 更新数据类型
  @Post('/data-types/:id')
  async updateDataType() {
    // return await this.service.findAllDataTypes();
  }

  /* 标签相关 */
  // 标签
  @Get('/tags')
  async getTags(@Query(new QueryPipe()) query: SearchQuery) {
    const data = await this.service.findAllTags(query);
    return data;
  }

  /**
   * 获取未分页的标签列表
   */
  @Get('/tags/all')
  async getAllTags() {
    return await this.service.findAllTags({}, false);
  }

  /**
   * 新增标签
   * @param param0
   */
  @Post('/tags')
  async createTag(@Body() { name, description = '', cloneBy = '' }) {
    if (isEmpty(name)) {
      throw new ApiException({
        code: CommonCodes.PARAMETER_INVALID,
        message: '标签名不能为空',
      });
    }
    return await this.service.createTag({
      name,
      description,
      cloneBy,
    });
  }

  // 获取分类树
  @Get('/categories/tree')
  async getCategoryTree() {
    return this.service.findCategoriesTree();
  }
  // 获取所有分类
  @Get('/categories')
  async getCategories() {
    return this.service.findAllCategories();
  }
  // 获取分类详情
  @Get('/categories/:id')
  async getCategory(@Param() { id }) {
    return this.service.findCategoryById(id);
  }

  // 更新分类
  @Post('/categories/:id')
  async updateCategory(@Param(){ id }, @Body() body) {
    return await this.service.updateCategory(id, body);
  }

  // 更新分类
  @Post('/categories/delete/:id')
  async deleteCategory(@Param(){ id }) {
    return await this.service.deleteCategory(id);
  }
  // 新增分类
  @Post('/categories')
  async createCategory(@Body() body) {
    return await this.service.createCategory(body);
  }
}
