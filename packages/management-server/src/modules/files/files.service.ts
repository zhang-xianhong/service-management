import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as COS from 'cos-nodejs-sdk-v5';
import { Sequelize } from 'sequelize';
import cosOpt from 'src/config/cos';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { CommonCodes, UploadStorage } from 'src/shared/constants/code';
import { ApiException } from 'src/shared/utils/api.exception';
import { ocr } from 'tencentcloud-sdk-nodejs';
import {  FilesModel } from './files.model';
import { fromBuffer } from 'file-type';

import {
  UPLOAD_MAX_FILE_SIZE,
  ROOT_PATH,
  UPLOAD_DIR_NAME,
  UPLOAD_ALLOW_EXTS,
  OCR_COMMON_CONFIG,
  UPLOAD_STORAGE,
} from 'src/shared/constants';
import { STATIC_FILE_SERVICE } from 'src/shared/constants/url';

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

  // 上传文件
  async uploadFile(file) {
    const { size, buffer } = file;
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
      const fileKey = `${hash}.${ext}`;
      if (UPLOAD_STORAGE === UploadStorage.COS_STORAGE) {
        return await this.uploadToCos(file, mime, fileKey, transaction);
      }
      return await this.uploadToLocal(file, mime, fileKey, transaction);
    } catch (error) {
      throw new ApiException({
        code: CommonCodes.UPLOAD_FAIL,
        message: '文件上传失败',
      });
    }
  }

  /**
   * 上传文件到cos存储
   * @param file
   * @param mimetype
   * @param fileKey
   * @param transaction
   * @returns
   */
  async uploadToCos(file, mimetype, fileKey, transaction) {
    const { originalname, size, buffer } = file;
    try {
      // 写数据库
      const attachment = {
        path: '',
        fileId: fileKey,
        size,
        name: originalname,
        mimetype,
      };
      await this.fileRepository.create(attachment, { transaction });
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


  /**
   * 上传文件到本地存储
   * @param file
   * @param mimetype
   * @param fileKey
   * @param transaction
   * @returns
   */
  async uploadToLocal(file, mimetype, fileKey, transaction) {
    const { originalname, size, buffer } = file;
    const tenantName = 'zhangsanfen';
    const filePath = `/${UPLOAD_DIR_NAME}/${tenantName}/${fileKey}`;
    const savePath = `${ROOT_PATH}${filePath}`;
    try {
      // 写数据库
      const attachment = {
        path: filePath,
        fileId: fileKey,
        size,
        name: originalname,
        mimetype,
      };
      await this.fileRepository.create(attachment, { transaction });

      // 创建租户文件夹，写入文件
      fs.mkdirSync(`${ROOT_PATH}/${UPLOAD_DIR_NAME}/${tenantName}`, { recursive: true });
      fs.writeFileSync(savePath, buffer);
      await transaction.commit();
      return {
        fileKey,
        filePath,
      };
    } catch (error) {
      this.logger.error(error);
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

  // 根据fileKey获取文件地址
  async getObjectUrl(fileKey): Promise<string> {
    // 根据存储位置获取文件地址
    switch (UPLOAD_STORAGE) {
      case UploadStorage.COS_STORAGE:
        return await this.getCosFileUrl(fileKey);
      default:
        return await this.getLocalFileUrl(fileKey);
    }
  }

  /**
   * 获取cos文件地址
   * @param key
   * @returns
   */
  async getCosFileUrl(key) {
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
        message: '获取文件地址失败',
        error: error.message || error,
      });
    }
  }

  /**
   * 获取本地静态服务文件地址
   * @param key
   * @returns
   */
  async getLocalFileUrl(key) {
    try {
      const { path } = await this.fileRepository.findOne({
        where: {
          fileId: key,
        },
      });
      return `${STATIC_FILE_SERVICE}${path}`;
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '获取文件地址失败',
        error: error.message || error,
      });
    }
  }
}
