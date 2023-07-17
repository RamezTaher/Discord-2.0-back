import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './utils/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ChannelsModule } from './channels/channels.module';
import { MessagesModule } from './messages/messages.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GatewaysModule } from './gateways/gateways.module';
import { GroupsModule } from './groups/groups.module';
import { GroupMessagesModule } from './group-messages/group-messages.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ envFilePath: '.env.development' }),
    PassportModule.register({ session: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_BD,
      synchronize: true,
      entities,
      logging: false,
    }),
    ChannelsModule,
    MessagesModule,
    EventEmitterModule.forRoot(),
    GatewaysModule,
    GroupsModule,
    GroupMessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
