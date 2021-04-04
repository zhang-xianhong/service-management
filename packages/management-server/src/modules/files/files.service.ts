import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as COS from 'cos-nodejs-sdk-v5';
// import * as fs  from 'fs';
import { Sequelize } from 'sequelize';
import cosOpt from 'src/config/cos';
import { OCR_COMMON_CONFIG } from 'src/shared/constants';
import { CommonCodes } from 'src/shared/constants/code';
import { ApiException } from 'src/shared/utils/api.exception';
import { ocr } from 'tencentcloud-sdk-nodejs';
import { v4 } from 'uuid';
import {  FilesModel } from './files.model';


@Injectable()
export class FilesService {
  private readonly cos: COS;
  private readonly ocrClient;
  constructor(
    private readonly logger: Logger,
    private readonly sequelize: Sequelize,

    @InjectModel(FilesModel)
    private readonly fileRepository: typeof FilesModel,
  ) {
    // 腾讯云配置
    this.cos = new COS({
      SecretId: cosOpt.SecretId,
      SecretKey: cosOpt.SecretKey,
    });
    const clientConfig = {
      credential: {
        secretId: cosOpt.SecretId,
        secretKey: cosOpt.SecretKey,
      },
      region: cosOpt.Region,
      profile: {
        httpProfile: {
          endpoint: cosOpt.Endpoint,
        },
      },
    };
    this.ocrClient = new ocr.v20181119.Client(clientConfig);
  }

  async getIDCardInfo(fileKey) {
    try {
      const url = await this.getObjectUrl(fileKey);
      const params = {
        Action: OCR_COMMON_CONFIG.Action,
        Version: OCR_COMMON_CONFIG.Version,
        Region: OCR_COMMON_CONFIG.Region,
        CardSide: OCR_COMMON_CONFIG,
        ImageUrl: url,
      };
      const { Response } = await this.ocrClient.IDCardOCR(params);
      return {
        name: Response.Name,
        IDCard: Response.IdNum,
      };
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '获取身份证信息失败',
        error: error.message || error,
      });
    }
  }

  async getLicenseInfo(name) {
    try {
      const params = {
        Action: OCR_COMMON_CONFIG.Action,
        Version: OCR_COMMON_CONFIG.Version,
        Region: OCR_COMMON_CONFIG.Region,
        CardSide: OCR_COMMON_CONFIG,
        Name: name,
      };
      const { Response } = await this.ocrClient.VerifyBasicBizLicense(params);
      return {
        creditCode: Response.CreditCode,
        name: Response.Entname,
        regno: Response.Regno,
      };
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '获取营业执照信息失败',
        error: error.message || error,
      });
    }
  }

  async uploadFile(file) {
    console.log(file);
    // const { originalname, mimetype, size, buffer } = file;
    const { originalname, mimetype, size } = file;
    const fileKey = v4();
    const fileData = {
      fileId: fileKey,
      name: originalname,
      fileType: mimetype,
      size,
    };
    const transaction = await this.sequelize.transaction();
    try {
      await this.fileRepository.create(fileData, { transaction });
      // 暂无 cos 账号
      // const params = {
      //   Bucket: cosOpt.Bucket,
      //   Region: cosOpt.Region,
      //   Key: fileKey,
      //   Body: buffer,
      // };
      // const data = await this.cos.putObject(params);
      // console.log('data', data);
      await transaction.commit();
      return {
        fileKey,
      };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '上传文件失败！',
        error: error.message || error,
      });
    }
  }

  async getObjectUrl(key) {
    try {
      const data: any = await new Promise((resolve, reject) => {
        this.cos.getObjectUrl({
          Bucket: cosOpt.Bucket,
          Region: cosOpt.Region,
          Key: key,
        }, (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
      });
      return {
        url: data.Url,
      };
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '获取文件链接失败',
        error: error.message || error,
      });
    }
  }
}
