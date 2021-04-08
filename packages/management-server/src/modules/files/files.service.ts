import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as COS from 'cos-nodejs-sdk-v5';
import { Sequelize } from 'sequelize';
import cosOpt from 'src/config/cos';
import * as crypto from 'crypto';
import * as fs from 'fs';
// import { FILE_MAX_SIZE, OCR_COMMON_CONFIG } from 'src/shared/constants';
import { CommonCodes } from 'src/shared/constants/code';
import { ApiException } from 'src/shared/utils/api.exception';
import { ocr } from 'tencentcloud-sdk-nodejs';
import { v4 } from 'uuid';
import {  FilesModel } from './files.model';
import { fromBuffer } from 'file-type';

import {
  UPLOAD_MAX_FILE_SIZE,
  ROOT_PATH,
  UPLOAD_DIR_NAME,
  UPLOAD_ALLOW_EXTS,
  OCR_COMMON_CONFIG,
} from 'src/shared/constants';

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
    const { originalname, mimetype, size, buffer } = file;
    if (size > UPLOAD_MAX_FILE_SIZE) {
      throw new ApiException({
        code: CommonCodes.UPLOAD_FAIL,
        message: '单个文件最大为10M！',
      });
    }
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
      const params = {
        Bucket: cosOpt.Bucket,
        Region: cosOpt.Region,
        Key: fileKey,
        Body: buffer,
      };
      const data = await this.cos.putObject(params);
      if (data.statusCode === 200) {
        await transaction.commit();
        return {
          fileKey,
        };
      }
      throw '文件上传失败';
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

  async getObjectUrl(key): Promise<string> {
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
      return data.Url;
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '获取文件链接失败',
        error: error.message || error,
      });
    }
  }


  // 上传到本地
  async uploadToLocal(file) {
    const { originalname, size, buffer } = file;
    if (size > UPLOAD_MAX_FILE_SIZE) {
      throw new ApiException({
        code: CommonCodes.UPLOAD_FAIL,
        message: '文件大小超过限制',
      });
    }
    const transaction = await this.sequelize.transaction();
    try {
      const { ext, mime } = (await fromBuffer(buffer)) || {};
      if (!ext || !UPLOAD_ALLOW_EXTS.includes(ext)) {
        throw new ApiException({
          code: CommonCodes.UPLOAD_FAIL,
          message: '文件类型不支持',
        });
      }
      const md5 = crypto.createHash('md5');
      const hash = md5.update(buffer).digest('hex');
      const filePath = `/${UPLOAD_DIR_NAME}/${hash}.${ext}`;
      const savePath = ROOT_PATH + filePath;
      // 写数据库
      const attachment = {
        path: filePath,
        hash,
        size,
        name: originalname,
        mimetype: mime,
      };
      fs.writeFileSync(savePath, buffer);
      // await this.repository.create(attachment);
      await transaction.commit();
      return {
        hash,
        filePath,
      };
    } catch (error) {
      await transaction.rollback();
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException({
        code: CommonCodes.UPLOAD_FAIL,
        message: '文件上传失败',
      });
    }
  }
}
