import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { Channel, Message } from 'src/utils/typeorm';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Channel])],
  controllers: [MessagesController],
  providers: [
    {
      provide: Services.MESSAGES,
      useClass: MessagesService,
    },
  ],
})
export class MessagesModule {}
