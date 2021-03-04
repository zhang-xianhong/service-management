import { Injectable } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataTypesEntity } from './settings-data-types.entity';

@Injectable()
export class SettingsService {
  constructor(
    private connection: Connection,
    @InjectRepository(DataTypesEntity)
    private readonly dataTypesRepository: Repository<DataTypesEntity>,
  ) {}

  async findDataTypes() {
    return (await this.dataTypesRepository.find());
  }
}
