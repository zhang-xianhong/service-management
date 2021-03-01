import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { QueryPipe, SearchQuery } from 'src/shared/pipes/query.pipe';
import { ProjectsService } from './projects.service';

@Controller('project')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Get()
  async projectList(@Query(new QueryPipe) query: SearchQuery) {
    if (query.keyword) {
      // 处理 search
    }
    const [list, total] = await this.projectService.findAll({
      ...query.conditions,
    });
    return {
      total,
      list,
    };
  }

  /**
   * 获取项目信息
   */
  @Get(':id')
  projectInfo(@Param() { id }) {
    return this.projectService.findOne(id);
  }

  /**
   *
   * @param body 新增项目
   */
  @Post()
  create(@Body() body) {
    this.projectService.create(body);
  }

  /**
   *
   * @param param0 更新项目
   * @param body
   */
  @Post(':id')
  update(@Param() { id }, @Body() body) {
    this.projectService.update(id, body);
  }
}
