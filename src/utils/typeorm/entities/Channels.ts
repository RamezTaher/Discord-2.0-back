import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'channels' })
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderId: number;

  @Column()
  senderUserName: string;

  @Column()
  receiverId: number;

  @Column()
  receiverUserName: string;
}
