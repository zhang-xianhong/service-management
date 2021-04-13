import { forwardRef, HttpModule, Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServicesApiModel } from './service-api.model';
import { ServicesDependencyModel } from './service-dependency.model';
import { ServicesInfoModel } from './service-info.model';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { SocketGateway } from 'src/shared/gateway/socket.gateway';
import { ModelsModule } from '../models/models.module';
import { ServicesConfigModel } from './service-config.model';
import { ServicesApiParamModel } from './service-api-param.model';
import { UsersModule } from '../users/users.module';
import { OwnersModule } from '../owners/owners.module';

@Module({
  imports: [SequelizeModule.forFeature([
    ServicesInfoModel,
    ServicesApiModel,
    ServicesDependencyModel,
    ServicesConfigModel,
    ServicesApiParamModel,
  ]),
  HttpModule,
  UsersModule,
  OwnersModule,
  forwardRef(() => ModelsModule),
  ],
  controllers: [ServicesController],
  providers: [ServicesService, SocketGateway, Logger],
  exports: [ServicesService],
})
export class ServicesModule {}
