import { Injectable } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnsEntity } from './settings-columns.entity';


@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(ColumnsEntity)
    private readonly infoRepository: Repository<ColumnsEntity>,
    private connection: Connection,
  ) {}
}
