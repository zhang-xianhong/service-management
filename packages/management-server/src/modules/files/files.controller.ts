import { Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly projectService: FilesService) {}

  /**
   * 上传文件
   */
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    return this.projectService.uploadFile(file);
  }

  /**
   * 获取文件下载链接
   */
  @Get('/url')
  async getObjectUrl(@Query() { fileKey }) {
    return await this.projectService.getObjectUrl(fileKey);
  }

  /**
   * 获取身份证信息
   */
  @Get('/idCard')
  async getIDCardInfo(@Query() { fileKey }) {
    return await this.projectService.getIDCardInfo(fileKey);
  }

  /**
   * 获取营业执照信息
   */
  @Get('/license')
  async getLicenseInfo(@Query() { name }) {
    return await this.projectService.getLicenseInfo(name);
  }
}
