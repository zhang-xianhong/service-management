import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonCodes } from 'src/shared/constants/code';
import { ApiException } from 'src/shared/utils/api.exception';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(ProjectEntity)
  private readonly repository: Repository<ProjectEntity>) {}

  async findAll(query) {
    return await this.repository.findAndCount(query);
  }

  async findOne(id: string) {
    const project = await this.repository.findOne({ where: { id } });
    if (!project) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '项目不存在',
      }, HttpStatus.NOT_FOUND);
    }
    return project;
  }

  async create(data) {
    return await this.repository.save(data);
  }
  async update(id: string, data: any) {
    return await this.repository.update(id, data);
  }
}
