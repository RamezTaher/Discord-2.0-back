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

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  messageContent: string;

  @CreateDateColumn({ name: 'created_at' })
  sentAt: number;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;

  @ManyToOne(() => Channel, (channel) => channel.messages)
  channel: Channel;

  @ManyToOne(() => Group, (group) => group.messages)
  group?: Group;
}
