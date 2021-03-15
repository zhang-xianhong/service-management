import { Logger, Module } from '@nestjs/common';
import { ModelsFieldsModel } from './models-fields.entity';
import { ModelsInfoModel } from './models-info.entity';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { DataTypesModel } from '../settings/settings-data-types.entity';
import { SequelizeModule } from '@nestjs/sequelize';
@Module({
  imports: [SequelizeModule.forFeature([ModelsInfoModel, ModelsFieldsModel, DataTypesModel])],
  controllers: [ModelsController],
  providers: [ModelsService, Logger],
  exports: [ModelsService],
})
export class ModelsModule {}
