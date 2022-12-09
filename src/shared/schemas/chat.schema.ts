import { z } from 'zod';

export const UserId = z.string().min(1).max(24);
export const UserName = z
  .string()
  .min(1, { message: 'Must be at least 1 character.' })
  .max(16, { message: 'Must be at most 16 characters.' });
export const Message = z.string().min(1).max(1000);
export const TimeSent = z.string();
export const RoomName = z
  .string()
  .min(1, { message: 'Must be at least 1 character.' })
  .max(16, { message: 'Must be at most 16 characters.' });

export const UserSchema = z.object({
  userId: UserId,
  userName: UserName,
  socketId: z.string(),
});

export const ChatMessageSchema = z.object({
  user: UserSchema,
  timeSent: TimeSent,
  message: Message,
  roomName: RoomName,
});

export const RoomSchema = z.object({
  name: RoomName,
  host: UserSchema,
  users: UserSchema.array(),
});

export const JoinRoomSchema = z.object({
  user: UserSchema,
  roomName: RoomName,
});
