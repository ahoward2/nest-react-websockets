import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UseGuards, UsePipes } from '@nestjs/common';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  Message,
  JoinRoom,
  KickUser,
} from '../../shared/interfaces/chat.interface';
import { Server, Socket } from 'socket.io';
import { RoomService } from '../room/room.service';
import { ZodValidationPipe } from '../pipes/zod.pipe';
import {
  ChatMessageSchema,
  JoinRoomSchema,
  KickUserSchema,
} from '../../shared/schemas/chat.schema';
import { UserService } from '../user/user.service';
import { ChatPoliciesGuard } from './guards/chat.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private roomService: RoomService,
    private userService: UserService,
  ) {}

  @WebSocketServer() server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();

  private logger = new Logger('ChatGateway');

  @UseGuards(ChatPoliciesGuard<Message>)
  @UsePipes(new ZodValidationPipe(ChatMessageSchema))
  @SubscribeMessage('chat')
  async handleChatEvent(
    @MessageBody()
    payload: Message,
  ): Promise<void> {
    this.logger.log(payload);
    this.server.to(payload.roomName).emit('chat', payload);
  }

  @UseGuards(ChatPoliciesGuard<JoinRoom>)
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
      await this.userService.addUser(payload.user);
      await this.server.in(payload.user.socketId).socketsJoin(payload.roomName);
      await this.roomService.addUserToRoom(
        payload.roomName,
        payload.user.userId,
      );
    }
  }

  @UseGuards(ChatPoliciesGuard<KickUser>)
  @UsePipes(new ZodValidationPipe(KickUserSchema))
  @SubscribeMessage('kick_user')
  async handleKickUserEvent(
    @MessageBody() payload: KickUser,
  ): Promise<boolean> {
    this.logger.log(
      `${payload.userToKick.userName} is getting kicked from ${payload.roomName}`,
    );
    await this.server.to(payload.roomName).emit('kick_user', payload);
    await this.server
      .in(payload.userToKick.socketId)
      .socketsLeave(payload.roomName);
    await this.server.to(payload.roomName).emit('chat', {
      user: {
        userId: 'serverId',
        userName: 'TheServer',
        socketId: 'ServerSocketId',
      },
      timeSent: new Date(Date.now()).toLocaleString('en-US'),
      message: `${payload.userToKick.userName} was kicked.`,
      roomName: payload.roomName,
    });
    return true;
  }

  async handleConnection(socket: Socket): Promise<void> {
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    const user = await this.roomService.getFirstInstanceOfUser(socket.id);
    if (user) {
      await this.userService.removeUserById(user.userId);
    }
    await this.roomService.removeUserFromAllRooms(socket.id);
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }
}
