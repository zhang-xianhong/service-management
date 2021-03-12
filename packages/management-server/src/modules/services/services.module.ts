import { HttpModule, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketGateway } from 'src/shared/gateway/socket.gateway';
import { ServicesApiEntity } from './service-api.entity';
import { ServicesDependencyEntity } from './service-dependency.entity';
import { ServicesInfoEntity } from './service-info.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServicesInfoEntity, ServicesApiEntity, ServicesDependencyEntity]), HttpModule],
  controllers: [ServicesController],
  providers: [ServicesService, SocketGateway, Logger],
  exports: [ServicesService],
})
export class ServicesModule {}
