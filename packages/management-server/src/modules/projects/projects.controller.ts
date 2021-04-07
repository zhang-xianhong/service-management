import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { QueryPipe, SearchQuery } from 'src/shared/pipes/query.pipe';
import { DeletedIdsDto, ParamIdDto } from '../base.dto';
import { MembersDto } from './dto/member.dto';
import { MemberDeleteDto } from './dto/member-delete.dto';
import { ProjectDto, ProjectUpdateDto } from './dto/project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Get()
  async findAll(@Query(new QueryPipe()) query: SearchQuery) {
    return this.service.findAll(query);
  }

  @Post()
  async createProject(@Body() postData: ProjectDto) {
    return await this.service.createProject(postData);
  }

  @Get(':id')
  async findById(@Param() { id }: ParamIdDto) {
    return this.service.findOne(id);
  }

  @Get(':id/members')
  async findProjectMembers(@Param() { id }: ParamIdDto) {
    return this.service.findMembersByProjectId(id);
  }

  // 删除项目
  @Post('/delete')
  async deleteProjects(@Body() { ids }: DeletedIdsDto) {
    return this.service.deleteProjects(ids);
  }

  // 更新项目
  @Post(':id')
  async updateProject(@Param() { id }: ParamIdDto, @Body() postData: ProjectUpdateDto) {
    return this.service.updateProject(id, postData);
  }


  /**
   * 新增组内成员
   * @param param0
   * @param postData
   * @returns
   */
  @Post('/:id/members')
  async updateMember(@Param() { id }: ParamIdDto, @Body() postData: MembersDto) {
    return await this.service.updateMembers(id, postData);
  }


  /**
   * 从项目的某个组里移除成员
   * @param param0
   * @param deleteIds
   * @returns
   */
  @Post('/:id/members/delete')
  async deleteMembers(@Param() { id }: ParamIdDto, @Body() { ids, projectRoleId }: MemberDeleteDto) {
    return await this.service.deleteMembers(id, projectRoleId, ids);
  }
}
