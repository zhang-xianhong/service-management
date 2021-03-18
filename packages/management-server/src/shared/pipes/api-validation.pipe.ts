import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { CommonCodes } from '../constants/code';
import { ApiException } from '../utils/api.exception';

export class ApiValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      stopAtFirstError: true,
    });
  }
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      throw new ApiException({
        code: CommonCodes.PARAMETER_INVALID,
        message: Array.isArray(e.response.message) ? e.response.message[0] : e.response.message,
      });
    }
  }
}
