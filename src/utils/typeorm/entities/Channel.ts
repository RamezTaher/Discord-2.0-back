import { Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChannelMember } from './ChannelMembers';

@Entity({ name: 'channels' })
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => ChannelMember, (channelMember) => channelMember.channels)
  channelMembers: ChannelMember[];
}
