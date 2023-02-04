import { AuthenticatedSocket } from 'src/utils/interfaces';

export interface IGatewaySessionManager {
  getUserSocket(id: number): AuthenticatedSocket;
  setUserSocket(id: number, socket: AuthenticatedSocket): void;
  removeUserSocket(id: number): void;
  getSockets(): Map<number, AuthenticatedSocket>;
}
