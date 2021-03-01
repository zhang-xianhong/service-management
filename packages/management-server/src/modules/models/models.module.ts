import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelsFieldsEntity } from './models-fields.entity';
import { ModelsInfoEntity } from './models-info.entity';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModelsInfoEntity, ModelsFieldsEntity])],
  controllers: [ModelsController],
  providers: [ModelsService],
  exports: [ModelsService],
})
export class ModelsModule {}
