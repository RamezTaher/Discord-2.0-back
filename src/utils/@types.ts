import { User } from './typeorm';

export type CreateUserParams = {
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
};

export type LoginUserParams = {
  email: string;
  password: string;
};

export type FindUserParams = Partial<{
  email: string;
  id: number;
}>;
export type FindChannelMemberParams = Partial<{
  id: number;
}>;

export type ChannelIdType = 'receiver' | 'sender';

export type CreateChannelParams = {
  senderId: number;
  senderUserName: string;
  receiverId: number;
  receiverUserName: string;
  message: string;
};
export type CreateChannelMemeberParams = {
  id: number;
};

export interface AuthenticatedRequest extends Request {
  user: User;
}
