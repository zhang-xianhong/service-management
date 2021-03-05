import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelsFieldsEntity } from './models-fields.entity';
import { ModelsInfoEntity } from './models-info.entity';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { DataTypesEntity } from '../settings/settings-data-types.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ModelsInfoEntity, ModelsFieldsEntity, DataTypesEntity])],
  controllers: [ModelsController],
  providers: [ModelsService, Logger],
  exports: [ModelsService],
})
export class ModelsModule {}
