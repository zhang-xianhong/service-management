import { Body, Controller,  Get,  Param, Post } from '@nestjs/common';
import { ModelsService } from './models.service';
import { Created, Deleted, Updated } from 'src/shared/types/response';
import { ApiException } from 'src/shared/utils/api.exception';
import { CommonCodes } from 'src/shared/constants/code';
import { ModelInfoDto } from './dto/model-info.dto';
import { ModelFieldsDto } from './dto/model-field.dto';
import { ModelRelationDto } from './dto/model-relation.dto';
import { DeletedIdsDto, NameUsableDto, ParamIdDto } from '../base.dto';
@Controller('models')
export class ModelsController {
  constructor(private readonly service: ModelsService) {}

  // 校验名称是否可用
  @Post('name/usable')
  async checkServiceNameUsable(@Body() { name, id }: NameUsableDto) {
    return await this.service.checkModelNameUsable(name, id);
  }

  // 创建模型
  @Post()
  async createModel(@Body() postData: ModelInfoDto): Promise<Created> {
    return await this.service.createdModel(postData);
  }

  // 删除模型
  @Post('/delete')
  async deleteModel(@Body() { ids }: DeletedIdsDto): Promise<Deleted> {
    return await this.service.deleteModel(ids);
  }

  // 更新创建模型字段
  @Post('/:id/fields')
  async updateOrCreateFields(
    @Body() { fields, serviceId }: ModelFieldsDto,
      @Param() { id }: ParamIdDto,
  ): Promise<number[]> {
    fields.reduce((prev, item) => {
      if (prev.includes(item.name)) {
        throw new ApiException({
          code: CommonCodes.PARAMETER_INVALID,
          message: `存在名称[${item.name}]相同的字段`,
        });
      }
      prev.push(item);
      return prev;
    }, []);
    return await this.service.updateOrCreateFields(id, serviceId, fields);
  }

  /**
   * 更新模型关系
   * @param param0
   * @returns
   */
  @Post('/relation')
  async createModelRelation(@Body() postData: ModelRelationDto): Promise<Created> {
    return await this.service.createModelRelation(postData);
  }

  /**
   * 删除模型关系
   * @param param0
   * @returns
   */
  @Post('/relation/delete')
  async deleteModelRelation(@Body() { ids }: DeletedIdsDto): Promise<Deleted> {
    return await this.service.deleteModelRelations(ids);
  }

  /**
   * 更新模型关系
   * @param param0
   * @returns
   */
  @Post('/relation/:id')
  async updateModelRelation(@Param() { id }: ParamIdDto, @Body() postData: ModelRelationDto): Promise<Updated> {
    return await this.service.updateModelRelation(id, postData);
  }

  // 更新模型
  @Post('/:id')
  async updateModel(@Body() postData: ModelInfoDto, @Param() { id }: ParamIdDto): Promise<Updated> {
    return await this.service.updateModel(postData, id);
  }


  // 获取指定模型详情
  @Get('/:id')
  async getModelInfo(@Param() { id }: ParamIdDto): Promise<any> {
    return await this.service.findModelInfoByModelId(id);
  }
}
