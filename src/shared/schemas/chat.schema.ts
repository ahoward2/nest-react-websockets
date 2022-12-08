import { z } from 'zod';

export const UserSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  socketId: z.string(),
});

export const ChatMessageSchema = z.object({
  user: UserSchema,
  timeSent: z.string(),
  message: z.string(),
  roomName: z.string(),
});

export const RoomSchema = z.object({
  name: z.string(),
  host: UserSchema,
  users: UserSchema.array(),
});
