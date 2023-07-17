import { Channel } from './entities/Channel';
import { GroupChannel } from './entities/GroupChannel';
import { Message } from './entities/Message';
import { Session } from './entities/Session';
import { User } from './entities/User';

const entities = [User, Session, Channel, Message, GroupChannel];

export default entities;

export { User, Session, Channel, Message, GroupChannel };
