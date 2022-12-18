import {
  RoomName,
  Room as RoomType,
  User,
} from '../../shared/interfaces/chat.interface';

export class Room implements RoomType {
  constructor(attrs: RoomType) {
    Object.assign(this, attrs);
  }
  name: RoomName;
  host: User;
  users: User[];
}
