import { z } from 'zod';
import {
  ChatMessageSchema,
  EventNameSchema,
  JoinRoomSchema,
  KickUserSchema,
  RoomNameSchema,
  RoomSchema,
  SocketIdSchema,
  UserIdSchema,
  UserNameSchema,
  UserSchema,
} from '../schemas/chat.schema';

export type UserId = z.infer<typeof UserIdSchema>;
export type UserName = z.infer<typeof UserNameSchema>;
export type SocketId = z.infer<typeof SocketIdSchema>;
export type User = z.infer<typeof UserSchema>;

export type RoomName = z.infer<typeof RoomNameSchema>;
export type Room = z.infer<typeof RoomSchema>;
export type EventName = z.infer<typeof EventNameSchema>;
export type Message = z.infer<typeof ChatMessageSchema>;

export type JoinRoom = z.infer<typeof JoinRoomSchema>;
export type KickUser = z.infer<typeof KickUserSchema>;

export interface ServerToClientEvents {
  chat: (e: Message) => void;
  kick_user: (e: KickUser) => void;
}

export interface ClientToServerEvents {
  chat: (e: Message) => void;
  join_room: (e: JoinRoom) => void;
  kick_user: (
    e: KickUser,
    completionCallback: (complete: boolean) => void,
  ) => void;
}
