import { z } from 'zod';
import {
  ChatMessageSchema,
  JoinRoomSchema,
  RoomSchema,
  UserSchema,
} from '../schemas/chat.schema';

export type User = z.infer<typeof UserSchema>;

export type Room = z.infer<typeof RoomSchema>;

export type Message = z.infer<typeof ChatMessageSchema>;

export type JoinRoom = z.infer<typeof JoinRoomSchema>;

export interface ServerToClientEvents {
  chat: (e: Message) => void;
}

export interface ClientToServerEvents {
  chat: (e: Message) => void;
  join_room: (e: JoinRoom) => void;
}
