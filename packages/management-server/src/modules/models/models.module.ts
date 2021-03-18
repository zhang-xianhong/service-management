import { Logger, Module } from '@nestjs/common';
import { ModelsFieldsModel } from './models-fields.model';
import { ModelsInfoModel } from './models-info.model';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { DataTypesModel } from '../settings/settings-data-types.model';
import { SequelizeModule } from '@nestjs/sequelize';
@Module({
  imports: [SequelizeModule.forFeature([ModelsInfoModel, ModelsFieldsModel, DataTypesModel])],
  controllers: [ModelsController],
  providers: [ModelsService, Logger],
  exports: [ModelsService],
})
export class ModelsModule {}
