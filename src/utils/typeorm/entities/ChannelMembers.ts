import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './Channel';

@Entity({ name: 'channel_members' })
export class ChannelMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @ManyToMany(() => Channel, (channel) => channel.channelMembers)
  @JoinTable()
  channels: Channel[];
}