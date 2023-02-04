import { Injectable } from '@nestjs/common';
import { AuthenticatedSocket } from 'src/utils/interfaces';
import { IGatewaySessionManager } from './gateways.interfaces';

@Injectable()
export class GatewaysSessionManager implements IGatewaySessionManager {
  private readonly sessions: Map<number, AuthenticatedSocket> = new Map();

  getUserSocket(userId: number) {
    return this.sessions.get(userId);
  }

  setUserSocket(userId: number, socket: AuthenticatedSocket) {
    this.sessions.set(userId, socket);
  }
  removeUserSocket(userId: number) {
    this.sessions.delete(userId);
  }
  getSockets(): Map<number, AuthenticatedSocket> {
    return this.sessions;
  }
}
