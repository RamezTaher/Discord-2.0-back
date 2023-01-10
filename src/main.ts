import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { PORT } = process.env;
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  try {
    await app.listen(PORT, () => console.log(`Running on ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
