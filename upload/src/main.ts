import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MulterExceptionFilter } from './multer-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Servir pasta uploads como arquivos estáticos
  // Path correto: uploads está na raiz do projeto
  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });

  // ✅ Habilitar CORS para requisições do Frontend Angular
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalFilters(new MulterExceptionFilter());

  await app.listen(3000);
}
bootstrap();