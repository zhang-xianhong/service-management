import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelFieldsEntity } from './model-fields.entity';
import { ModelInfoEntity } from './model-info.entity';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModelInfoEntity, ModelFieldsEntity])],
  controllers: [ModelController],
  providers: [ModelService],
  exports: [ModelService],
})
export class ModelModule {}
