import { ChannelMember } from './entities/ChannelMembers';
import { Channel } from './entities/Channel';
import { Session } from './entities/Sessions';
import { User } from './entities/User';

const entities = [User, Session, Channel, ChannelMember];

export default entities;

export { User, Session, Channel, ChannelMember };
