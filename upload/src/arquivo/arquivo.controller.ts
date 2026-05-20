import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ArquivoService } from './arquivo.service';
import { UpdateArquivoDto } from './dto/update-arquivo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('arquivo')
export class ArquivoController {
  constructor(private readonly arquivoService: ArquivoService) {}

  // ✅ UPLOAD (CORRIGIDO)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),

      limits: {
        fileSize: 5 * 1024 * 1024,
      },

      fileFilter: (req, file, callback) => {
        const tiposPermitidos = /jpeg|jpg|png|gif|webp/;

        const isMimeValid = tiposPermitidos.test(file.mimetype);
        const isExtValid = tiposPermitidos.test(
          extname(file.originalname).toLowerCase(),
        );

        if (isMimeValid && isExtValid) {
          return callback(null, true);
        }

        return callback(
          new BadRequestException(
            'Apenas arquivos de imagem são permitidos (jpg, png, gif, webp).',
          ),
          false,
        );
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.arquivoService.create(file);
  }

  // ✅ GET (AGORA VAI FUNCIONAR)
  @Get()
  findAll() {
    return this.arquivoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.arquivoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateArquivoDto: UpdateArquivoDto,
  ) {
    return this.arquivoService.update(+id, updateArquivoDto);
  }

  // ✅ DELETE
  @Delete('delete/:filename')
  removeByName(@Param('filename') filename: string) {
    return this.arquivoService.removeByName(filename);
  }
}