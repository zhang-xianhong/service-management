import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesApiEntity } from './service-api.entity';
import { ServicesDependencyEntity } from './service-dependency.entity';
import { ServicesInfoEntity } from './service-info.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServicesInfoEntity, ServicesApiEntity, ServicesDependencyEntity])],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
