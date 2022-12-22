import { z } from 'zod';

export const UserIdSchema = z.string().min(1).max(24);

export const UserNameSchema = z
  .string()
  .min(1, { message: 'Must be at least 1 character.' })
  .max(16, { message: 'Must be at most 16 characters.' });

export const MessageSchema = z
  .string()
  .min(1, { message: 'Must be at least 1 character.' })
  .max(1000, { message: 'Must be at most 1000 characters.' });

export const TimeSentSchema = z.number();

export const RoomNameSchemaRegex = new RegExp('^\\S+\\w$');

export const RoomNameSchema = z
  .string()
  .min(2, { message: 'Must be at least 2 characters.' })
  .max(16, { message: 'Must be at most 16 characters.' })
  .regex(RoomNameSchemaRegex, {
    message: 'Must not contain spaces or special characters.',
  });

export const EventNameSchema = z.enum(['chat', 'kick_user', 'join_room']);

export const SocketIdSchema = z
  .string()
  .length(20, { message: 'Must be 20 characters.' });

export const UserSchema = z.object({
  userId: UserIdSchema,
  userName: UserNameSchema,
  socketId: SocketIdSchema,
});

export const ChatMessageSchema = z.object({
  user: UserSchema,
  timeSent: TimeSentSchema,
  message: MessageSchema,
  roomName: RoomNameSchema,
  eventName: EventNameSchema,
});

export const RoomSchema = z.object({
  name: RoomNameSchema,
  host: UserSchema,
  users: UserSchema.array(),
});

export const JoinRoomSchema = z.object({
  user: UserSchema,
  roomName: RoomNameSchema,
  eventName: EventNameSchema,
});

export const KickUserSchema = z.object({
  user: UserSchema,
  userToKick: UserSchema,
  roomName: RoomNameSchema,
  eventName: EventNameSchema,
});

export const KickUserEventAckSchema = z
  .function()
  .args(z.boolean())
  .returns(z.void());

export const KickUserEventSchema = z
  .function()
  .args(KickUserSchema, KickUserEventAckSchema)
  .returns(z.void());

export const ChatEventAckSchema = z
  .function()
  .args(z.boolean())
  .returns(z.void());

export const ChatEventSchema = z
  .function()
  .args(ChatMessageSchema, ChatEventAckSchema)
  .returns(z.void());

export const JoinRoomEventAckSchema = z
  .function()
  .args(z.boolean())
  .returns(z.void());

export const JoinRoomEventSchema = z
  .function()
  .args(JoinRoomSchema, JoinRoomEventAckSchema)
  .returns(z.void());

export const ClientToServerEventsSchema = z.object({
  chat: ChatEventSchema,
  join_room: JoinRoomEventSchema,
  kick_user: KickUserEventSchema,
});

export const ServerToClientEventsSchema = z.object({
  chat: ChatEventSchema,
  kick_user: KickUserEventSchema,
});
