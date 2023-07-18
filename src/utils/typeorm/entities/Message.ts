import { Entity, ManyToOne } from 'typeorm';
import { Channel } from './Channel';
import { BaseMessage } from './BaseMessage';

@Entity({ name: 'messages' })
export class Message extends BaseMessage {
  @ManyToOne(() => Channel, (channel) => channel.messages)
  channel: Channel;
}
