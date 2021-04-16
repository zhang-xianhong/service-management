import { Body, Controller, Get, Param, Post, Query  } from '@nestjs/common';
import { QueryPipe, SearchQuery } from 'src/shared/pipes/query.pipe';
import { DeletedIdsDto, ParamIdDto } from '../base.dto';
import { SettingsCategoryDto } from './dto/settings-category.dto';
import { SettingsDataTypeDto } from './dto/settings-data-type.dto';
import { SettingsTagDto } from './dto/settings-tag.dto';
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
  async getDataTypeById(@Param() { id }: ParamIdDto) {
    return await this.service.findDataTypeById(id);
  }

  // 创建数据类型
  @Post('/data-types')
  async createDataType(@Body() postData: SettingsDataTypeDto) {
    return await this.service.createDataType(postData);
  }

  // 删除数据类型
  @Post('/data-types/delete')
  async deleteDataType(@Body() { ids }: DeletedIdsDto) {
    return await this.service.deleteDataTypes(ids);
  }

  // 更新数据类型
  @Post('/data-types/:id')
  async updateDataType(@Param() { id }: ParamIdDto, @Body() postData: SettingsDataTypeDto) {
    return await this.service.updateDataType(id, postData);
  }

  /* 标签相关 */
  /**
   * 获取标签列表(分页)
   * @param query
   * @returns
   */
  @Get('/tags')
  async getTags(@Query(new QueryPipe()) query: SearchQuery) {
    const data = await this.service.findAllTags(query);
    return data;
  }

  /**
   * 获取标签列表(未分页)
   * @returns
   */
  @Get('/tags/all')
  async getAllTags() {
    return await this.service.findAllTags({}, false);
  }

  /**
   * 获取标签详情
   * @param param0
   * @returns
   */
  @Get('/tags/:id')
  async getTagById(@Param() { id }: ParamIdDto) {
    return await this.service.findTagById(id);
  }

  /**
   * 新增标签
   * @param param0
   */
  @Post('/tags')
  async createTag(@Body() postData: SettingsTagDto) {
    return await this.service.createTag(postData);
  }

  /**
    * 删除数据标签
    * @param param0
    * @returns
    */
  @Post('/tags/delete')
  async deleteTags(@Body() { ids }: DeletedIdsDto) {
    return await this.service.deleteTags(ids);
  }

  /**
   * 更新标签
   * @param param0
   * @param postData
   * @returns
   */
  @Post('/tags/:id')
  async updateTag(@Param() { id }: ParamIdDto, @Body() postData: SettingsTagDto) {
    return await this.service.updateTag(id, postData);
  }

  /* 分类相关 */
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
  async getCategory(@Param() { id }: ParamIdDto) {
    return this.service.findCategoryById(id);
  }

  // 更新分类
  @Post('/categories/:id')
  async updateCategory(@Param(){ id }: ParamIdDto, @Body() body) {
    return await this.service.updateCategory(id, body);
  }

  // 更新分类
  @Post('/categories/delete/:id')
  async deleteCategory(@Param(){ id }: ParamIdDto) {
    return await this.service.deleteCategory(id);
  }
  // 新增分类
  @Post('/categories')
  async createCategory(@Body() body: SettingsCategoryDto) {
    return await this.service.createCategory(body);
  }

  // 数据字典相关
  // 获取数据字典类型列表
  @Get('/dictionaries/type')
  async dictionaryTypes(@Query(new QueryPipe()) query: SearchQuery) {
    return await this.service.getDictionaryTypes(query);
  }

  // 获取字典详情
  @Get('/dictionaries/:typeKey')
  async getDictionaries(@Param() { typeKey }) {
    return await this.service.findDictionaryInfo(typeKey);
  }
  // 添加数据字典类型
  @Post('/dictionaries/type')
  async addDictionaryType(@Body() body) {
    return await this.service.addDictionaryType(body);
  }

  // 添加数据字典数据
  @Post('/dictionaries/:id')
  async addDictionaryData(@Param(){ id }, @Body() body) {
    return await this.service.addDictionaries(id, body);
  }

  // 获取行政区域
  @Get('/regions')
  async getRegionList(@Query() { level }) {
    return await this.service.getRegionListByLevel(level);
  }
  // 获取行政区域树
  @Get('/regions/tree')
  async getRegionTree(@Query() { code }) {
    return await this.service.getRegionTree(code);
  }

  /* 模板相关 */
  /**
   * 获取模板列表(分页)
   * @param query
   * @returns
   */
  @Get('/templates')
  async getTemplates(@Query(new QueryPipe()) query: SearchQuery) {
    const data = await this.service.findAllTemplates(query);
    return data;
  }

  /**
    * 获取模板列表(未分页)
    * @returns
    */
  @Get('/templates/all')
  async getAllTemplates(@Query(new QueryPipe()) query: SearchQuery) {
    return await this.service.findAllTemplates(query, false);
  }

  @Post('role')
  async addProjectRole(@Body()body) {
    await this.service.addProjectRoles(body);
  }
}
