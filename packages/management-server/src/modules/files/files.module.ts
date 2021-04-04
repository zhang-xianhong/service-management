import { Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FilesModel } from './files.model';

@Module({
  imports: [SequelizeModule.forFeature([
    FilesModel,
  ]),
  ],
  controllers: [FilesController],
  providers: [FilesService, Logger],
  exports: [FilesService],
})
export class FileModule { }
