import { HttpModule, Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServicesApiModel } from './service-api.entity';
import { ServicesDependencyModel } from './service-dependency.entity';
import { ServicesInfoModel } from './service-info.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { SocketGateway } from 'src/shared/gateway/socket.gateway';

@Module({
  imports: [SequelizeModule.forFeature([ServicesInfoModel, ServicesApiModel, ServicesDependencyModel]), HttpModule],
  controllers: [ServicesController],
  providers: [ServicesService, SocketGateway, Logger],
  exports: [ServicesService],
})
export class ServicesModule {}
