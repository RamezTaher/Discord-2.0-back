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

  @ManyToMany(() => Channel, (channel) => channel.channelMembers)
  @JoinTable()
  channels: Channel[];
}
