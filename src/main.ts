import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { getRepository } from 'typeorm';
import { Session } from './utils/typeorm';
import { TypeormStore } from 'connect-typeorm/out';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WebsocketAdapter } from './gateways/gateways.adapter';

async function bootstrap() {
  const { PORT, SECRET_CODE } = process.env;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const sessionRepository = getRepository(Session);
  const adapter = new WebsocketAdapter(app);
  app.useWebSocketAdapter(adapter);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
    credentials: true,
  });
  app.set('trust proxy', 'loopback');
  app.use(
    session({
      secret: SECRET_CODE,
      saveUninitialized: false,
      resave: false,
      name: 'DISCORD_SESSION_ID',
      cookie: {
        maxAge: 3600000,
      },
      store: new TypeormStore().connect(sessionRepository),
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
