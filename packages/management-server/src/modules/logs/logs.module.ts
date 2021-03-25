import { HttpModule, Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';

@Module({
  imports: [SequelizeModule.forFeature([]),
    HttpModule],
  controllers: [LogsController],
  providers: [LogsService, Logger],
  exports: [LogsService],
})
export class LogsModule {}
