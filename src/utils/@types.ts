import { Channel, Message, User } from './typeorm';

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
export type CreateChannelMemeberParams = {
  id: number;
};

export type ChannelIdType = 'receiver' | 'sender';

export type CreateChannelParams = {
  email: string;
  message: string;
};

export type CreateMessageParams = {
  messageContent: string;
  channelId: number;
  user: User;
};

export type CreateMessageResponse = {
  message: Message;
  channel: Channel;
};

export type DeleteMessageParams = {
  userId: number;
  channelId: number;
  messageId: number;
};

export type UpdateMessageParams = {
  channelId: number;
  messageId: number;
  userId: number;
  messageContent: string;
};

export type CreateGroupParams = {
  creator: User;
  title?: string;
  users: string[];
};

export type FetchGroupsParams = {
  userId: number;
};

export type CreateGroupMessageParams = {
  groupId: number;
  messageContent: string;
  sender: User;
};

export interface AuthenticatedRequest extends Request {
  user: User;
}
