import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  Message,
  User,
} from '../../shared/interfaces/chat.interface';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private userService: UserService) {}

  @WebSocketServer() server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();

  private logger = new Logger('ChatGateway');

  @SubscribeMessage('chat')
  async handleChatEvent(
    @MessageBody()
    payload: Message,
  ): Promise<Message> {
    this.logger.log(payload);
    this.server.emit('chat', payload); // broadcast messages
    return payload;
  }

  @SubscribeMessage('set_client_data')
  async handleSetClientDataEvent(
    @MessageBody()
    payload: User,
  ) {
    if (payload.socketId) {
      this.userService.updateUserData(payload.socketId, {
        userId: payload.userId,
        userName: payload.userName,
      });
    }
  }

  async handleConnection(socket: Socket): Promise<void> {
    this.userService.addUserSocketId(socket.id);
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    this.userService.removeUser(socket.id);
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }
}
