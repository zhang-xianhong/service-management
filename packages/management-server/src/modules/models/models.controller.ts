import { Body, Controller,  Param, Post } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelInfoDto } from './dto/model-info.dto';
import { Created, Deleted, Updated } from 'src/shared/types/response';
import { ModelsFieldsModel } from './models-fields.model';
@Controller('models')

export class ModelsController {
  constructor(private readonly service: ModelsService) {}

  // 创建模型
  @Post()
  async createModel(@Body() postData: ModelInfoDto): Promise<Created> {
    return await this.service.createdModel(postData);
  }

  // 删除模型
  @Post('/delete')
  async deleteModel(@Body() { ids }): Promise<Deleted> {
    return await this.service.deleteModel(ids);
  }

  // 更新创建模型字段
  @Post('/fields')
  async updateModelFields(@Body() { modelId, fields }): Promise<ModelsFieldsModel[]> {
    return await this.service.updateModelFields(modelId, fields);
  }

  // 更新模型
  @Post('/:id')
  async updateModel(@Body() postData: ModelInfoDto, @Param() { id }): Promise<Updated> {
    return await this.service.updateModel(postData, id);
  }
}
