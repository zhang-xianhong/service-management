import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesApiEntity } from './services-api.entity';
import { ServicesDependencyEntity } from './services-dependency.entity';
import { ServicesInfoEntity } from './services-info.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServicesInfoEntity, ServicesApiEntity, ServicesDependencyEntity])],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
