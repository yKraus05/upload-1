import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import { UpdateArquivoDto } from './dto/update-arquivo.dto';

@Injectable()
export class ArquivoService {
  private readonly pastaUpload = './uploads';

  constructor() {
    if (!fs.existsSync(this.pastaUpload)) {
      fs.mkdirSync(this.pastaUpload, { recursive: true });
    }
  }

  // ✅ Upload
  create(arquivo: Express.Multer.File) {
    if (!arquivo) {
      throw new BadRequestException('Arquivo inválido.');
    }

    return {
      message: 'Arquivo enviado com sucesso!',
      filename: arquivo.filename,
      originalname: arquivo.originalname,
      size: arquivo.size,
    };
  }

  // ✅ Listar arquivos
  findAll() {
    try {
      const files = fs.readdirSync(this.pastaUpload);

      const fileList = files.map((filename) => {
        const stats = fs.statSync(`${this.pastaUpload}/${filename}`);

        return {
          filename,
          size: stats.size,
          criado: stats.birthtime,
        };
      });

      return {
        total: fileList.length,
        files: fileList,
      };
    } catch (error) {
      throw new BadRequestException(
        'Não foi possível listar os arquivos.',
      );
    }
  }

  // 🔥 NOVO: Remover por nome (com 404 real)
  removeByName(filename: string) {
    const filePath = `${this.pastaUpload}/${filename}`;

    // ❌ arquivo não existe
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Arquivo não encontrado.');
    }

    // ✅ remove o arquivo
    fs.unlinkSync(filePath);

    return {
      message: 'Arquivo removido com sucesso!',
      filename,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} arquivo`;
  }

  update(id: number, updateArquivoDto: UpdateArquivoDto) {
    return `This action updates a #${id} arquivo`;
  }

  remove(id: number) {
    return `This action removes a #${id} arquivo`;
  }
}