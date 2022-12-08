import { z } from 'zod';
import {
  ChatMessageSchema,
  RoomSchema,
  UserSchema,
} from '../schemas/chat.schema';

export type User = z.infer<typeof UserSchema>;

export type Room = z.infer<typeof RoomSchema>;

export type Message = z.infer<typeof ChatMessageSchema>;

export interface ServerToClientEvents {
  chat: (e: Message) => void;
}

export interface ClientToServerEvents {
  chat: (e: Message) => void;
  join_room: (e: { user: User; roomName: string }) => void;
}
