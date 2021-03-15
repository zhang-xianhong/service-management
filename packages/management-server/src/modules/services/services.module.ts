import { HttpModule, Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServicesApiEntity } from './service-api.entity';
import { ServicesDependencyEntity } from './service-dependency.entity';
import { ServicesInfoEntity } from './service-info.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [SequelizeModule.forFeature([ServicesInfoEntity, ServicesApiEntity, ServicesDependencyEntity]), HttpModule],
  controllers: [ServicesController],
  providers: [ServicesService, Logger],
  exports: [ServicesService],
})
export class ServicesModule {}
