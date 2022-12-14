import {
  SocketId,
  User as UserType,
  UserId,
  UserName,
} from '../../shared/interfaces/chat.interface';

export class User implements UserType {
  constructor(attrs) {
    Object.assign(this, attrs);
  }
  userId: UserId;
  userName: UserName;
  socketId: SocketId;
}