
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnsEntity } from './settings-columns.entity';
import { DataTypesEntity } from './settings-data-types.entity';
import { DictionariesEntity } from './settings-dictionaries.entity';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([ColumnsEntity, DictionariesEntity, DataTypesEntity])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
