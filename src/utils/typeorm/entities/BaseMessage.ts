import {
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

export abstract class BaseMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  messageContent: string;

  @CreateDateColumn({ name: 'created_at' })
  sentAt: Date;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;
}
