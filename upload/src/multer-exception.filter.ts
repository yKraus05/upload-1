import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { MulterError } from 'multer';
import { Response } from 'express';

/**
 * ✅ Filtro de exceção para erros de upload Multer
 * Retorna status HTTP 413 (Payload Too Large) com mensagem JSON clara
 * quando o arquivo enviado ultrapassa o limite de 5MB
 *
 * COMENTÁRIO: Este filter captura erros específicos do Multer e converte em
 * respostas HTTP adequadas. O código 'LIMIT_FILE_SIZE' é disparado quando
 * um arquivo excede o limite definido em FileInterceptor (5MB).
 */
@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 🔍 VALIDAÇÃO: Erro de arquivo muito grande (> 5MB)
    // Retorna HTTP 413 (Payload Too Large) - status adequado para limite de tamanho
    if (exception.code === 'LIMIT_FILE_SIZE') {
      return response.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
        statusCode: HttpStatus.PAYLOAD_TOO_LARGE, // 413
        message: 'Arquivo muito grande. O limite máximo é 5MB.',
        error: 'Payload Too Large',
        timestamp: new Date().toISOString(),
      });
    }

    // ❌ Erro genérico de multer
    return response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message || 'Erro ao processar o arquivo.',
      error: 'Bad Request',
      timestamp: new Date().toISOString(),
    });
  }
}