import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { PORT, SECRET_CODE } = process.env;
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  app.use(
    session({
      secret: SECRET_CODE,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 360000 * 48,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  try {
    await app.listen(PORT, () => console.log(`Running on ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
