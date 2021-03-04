import { Injectable } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ServicesApiEntity } from './service-api.entity';
import { ServicesDependencyEntity } from './service-dependency.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServicesApiEntity)
    private readonly apiRepository: Repository<ServicesApiEntity>,
    @InjectRepository(ServicesDependencyEntity)
    private readonly depRepository: Repository<ServicesDependencyEntity>,
    private connection: Connection,
  ) {}
}
