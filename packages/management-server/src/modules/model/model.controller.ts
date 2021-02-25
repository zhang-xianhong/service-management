import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiException } from 'src/shared/utils/api.exception';
import { isEmpty } from '../../shared/utils/validator';
import { ModelCodes } from '../../shared/constants/code';
import { ModelService } from './model.service';
@Controller('model')

export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  /**
   * 获取指定用户信息
   * @param param0
   */
  @Get(':id')
  async findOneById(@Param() { id }) {
    const res = await this.modelService.findById(Number(id));
    return res;
  }


  @Post()
  async create(@Body() postData) {
    const { name } = postData;
    if (isEmpty(name)) {
      throw new ApiException({
        code: ModelCodes.NAME_INVALID,
        message: '无效的模型名称',
      });
    }
    // TODO. 校验fields
    return await this.modelService.create(postData);
  }

  // async saveFields(field, modelId) {
  //   const { name } = field;
  //   if (isEmpty(name)) {
  //     throw new ApiException({
  //       code: ModelCodes.NAME_INVALID,
  //       message: '无效的名称',
  //     });
  //   }
  // }

  // @Post('/field')
  // async createField(@Body() postData) {
  //   const { name, modelId } = postData;
  //   if (isEmpty(name)) {
  //     throw new ApiException({
  //       code: ModelCodes.NAME_INVALID,
  //       message: '无效的名称',
  //     });
  //   }
  //   if (isEmpty(modelId)) {
  //     throw new ApiException({
  //       code: ModelCodes.MODEL_ID_INVALID,
  //       message: 'modelId不能为空',
  //     });
  //   }
  //   return await this.modelService.createField(postData);
  // }
}
