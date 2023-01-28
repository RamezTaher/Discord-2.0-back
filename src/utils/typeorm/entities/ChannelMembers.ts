import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './Channel';
import { User } from './User';

@Entity({ name: 'channel_members' })
export class ChannelMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Channel, (channel) => channel.channelMembers)
  @JoinTable()
  channels: Channel[];

  @OneToOne(() => User, (user) => user.channelMember)
  user: User;
}
