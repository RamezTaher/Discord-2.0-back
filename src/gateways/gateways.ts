import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Services } from '../utils/constants';
import { AuthenticatedSocket } from '../utils/interfaces';
import { Message } from '../utils/typeorm';
import { IGatewaySessionManager } from './gateways.session';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class MessagingGateway implements OnGatewayConnection {
  constructor(
    @Inject(Services.GATEWAYS_SESSION_MANAGER)
    private readonly sessions: IGatewaySessionManager,
  ) {}

  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    console.log('New Incoming Connection');
    console.log(socket.user);
    this.sessions.setUserSocket(socket.user.id, socket);
    socket.emit('connected', { status: 'good' });
  }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createMessage')
  handleCreateMessage(@MessageBody() data: any) {
    console.log('Create Message');
  }

  @OnEvent('message.create')
  handleMessageCreateEvent(payload: Message) {
    console.log('Inside message.create');
    console.log(payload);
    const {
      sender: author,
      channel: { sender: creator, receiver },
    } = payload;

    const senderSocket = this.sessions.getUserSocket(author.id);
    const receiverSocket =
      author.id === creator.id
        ? this.sessions.getUserSocket(receiver.id)
        : this.sessions.getUserSocket(creator.id);

    console.log(`Recipient Socket: ${JSON.stringify(receiverSocket.user)}`);

    receiverSocket.emit('onMessage', payload);
    senderSocket.emit('onMessage', payload);
  }
}
