import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './Channel';
import { User } from './User';
import { Group } from './Group';
import { BaseMessage } from './BaseMessage';

@Entity({ name: 'messages' })
export class Message extends BaseMessage {
  @ManyToOne(() => Channel, (channel) => channel.messages)
  channel: Channel;
}
