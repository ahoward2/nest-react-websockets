import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UsePipes } from '@nestjs/common';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  Message,
  JoinRoom,
} from '../../shared/interfaces/chat.interface';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user/user.service';
import { ZodValidationPipe } from './pipes/chat.pipe';
import {
  ChatMessageSchema,
  JoinRoomSchema,
} from '../../shared/schemas/chat.schema';

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

  @UsePipes(new ZodValidationPipe(ChatMessageSchema))
  @SubscribeMessage('chat')
  async handleChatEvent(
    @MessageBody()
    payload: Message,
  ): Promise<void> {
    this.logger.log(payload);
    this.server.to(payload.roomName).emit('chat', payload); // broadcast messages
  }

  @UsePipes(new ZodValidationPipe(JoinRoomSchema))
  @SubscribeMessage('join_room')
  async handleSetClientDataEvent(
    @MessageBody()
    payload: JoinRoom,
  ): Promise<void> {
    if (payload.user.socketId) {
      this.logger.log(
        `${payload.user.socketId} is joining ${payload.roomName}`,
      );
      await this.server.in(payload.user.socketId).socketsJoin(payload.roomName);
      await this.userService.addUserToRoom(payload.roomName, payload.user);
    }
  }

  async handleConnection(socket: Socket): Promise<void> {
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    await this.userService.removeUserFromAllRooms(socket.id);
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }
}
