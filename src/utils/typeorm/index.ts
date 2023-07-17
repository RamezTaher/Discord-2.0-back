import { Channel } from './entities/Channel';
import { Group } from './entities/Group';
import { GroupMessage } from './entities/GroupMessage';
import { Message } from './entities/Message';
import { Session } from './entities/Session';
import { User } from './entities/User';

const entities = [User, Session, Channel, Message, Group, GroupMessage];

export default entities;

export { User, Session, Channel, Message, Group, GroupMessage };
