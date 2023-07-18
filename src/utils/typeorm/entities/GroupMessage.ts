import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from './Group';
import { User } from './User';

@Entity({ name: 'group_messages' })
export class GroupMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  messageContent: string;

  @CreateDateColumn({ name: 'created_at' })
  sentAt: number;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;

  @ManyToOne(() => Group, (group) => group.messages)
  group: Group;
}
