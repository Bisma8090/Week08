import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: ['http://localhost:3000', 'https://week08-snowy.vercel.app'] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api', { exclude: ['/'] });
  await app.listen(3001);
  console.log('Backend running on http://localhost:3001');
}
bootstrap();
