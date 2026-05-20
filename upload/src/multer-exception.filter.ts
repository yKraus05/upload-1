import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { MulterError } from 'multer';

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.code === 'LIMIT_FILE_SIZE') {
      return response.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
        statusCode: 413,
        message: 'Arquivo muito grande!',
      });
    }

    return response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: 400,
      message: exception.message,
    });
  }
}