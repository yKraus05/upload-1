import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ArquivoService } from './arquivo.service';
import { CreateArquivoDto } from './dto/create-arquivo.dto';
import { UpdateArquivoDto } from './dto/update-arquivo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('arquivo')
export class ArquivoController {
  constructor(private readonly arquivoService: ArquivoService) {}

 @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
       throw new BadRequestException('Nenhum arquivo enviado.');
    }
  }

  @Get()
  findAll() {
    return this.arquivoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.arquivoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArquivoDto: UpdateArquivoDto) {
    return this.arquivoService.update(+id, updateArquivoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.arquivoService.remove(+id);
  }
}
