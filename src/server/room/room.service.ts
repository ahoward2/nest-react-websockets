import { Injectable } from '@nestjs/common';
import { Room } from '../entities/room.entity';
import { User } from '../entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class RoomService {
  constructor(private userService: UserService) {}
  private rooms: Room[] = [];

  async addRoom(roomName: Room['name'], hostId: User['userId']): Promise<void> {
    const hostUser = await this.userService.getUserById(hostId);
    if (hostUser === 'Not Exists') {
      throw 'The host user with which you are attempting to create a new room does not exist';
    }
    const room = await this.getRoomIndexByName(roomName);
    if (room === -1) {
      await this.rooms.push(
        new Room({ name: roomName, host: hostUser, users: [hostUser] }),
      );
    }
  }

  async removeRoom(roomName: Room['name']): Promise<void> {
    const roomIndex = await this.getRoomIndexByName(roomName);
    if (roomIndex === -1) {
      throw 'The room which you are attempting to remove does not exist';
    }
    this.rooms.splice(roomIndex, roomIndex);
  }

  async getRoomHost(hostName: Room['host']['userName']): Promise<User> {
    const roomIndex = await this.getRoomIndexByName(hostName);
    return this.rooms[roomIndex].host;
  }

  async getRoomIndexByName(roomName: Room['name']): Promise<number> {
    const roomIndex = this.rooms.findIndex((room) => room?.name === roomName);
    return roomIndex;
  }

  async getRoomByName(roomName: Room['name']): Promise<Room | 'Not Exists'> {
    const findRoom = this.rooms.find((room) => room.name === roomName);
    if (!findRoom) {
      return 'Not Exists';
    }
    return findRoom;
  }

  async addUserToRoom(
    roomName: Room['name'],
    userId: User['userId'],
  ): Promise<void> {
    const roomIndex = await this.getRoomIndexByName(roomName);
    const newUser = await this.userService.getUserById(userId);
    if (newUser === 'Not Exists') {
      throw 'The user which you are attempting to add to a room does not exist';
    }
    if (roomIndex !== -1) {
      this.rooms[roomIndex].users.push(newUser);
      const host = await this.getRoomHost(roomName);
      if (host.userId === newUser.userId) {
        this.rooms[roomIndex].host.socketId = newUser.socketId;
      }
    } else {
      await this.addRoom(roomName, newUser.userId);
    }
  }

  async getRoomsByUserSocketId(socketId: User['socketId']): Promise<Room[]> {
    const filteredRooms = this.rooms.filter((room) => {
      const found = room.users.find((user) => user.socketId === socketId);
      if (found) {
        return found;
      }
    });
    return filteredRooms;
  }

  async getFirstInstanceOfUser(socketId: User['socketId']): Promise<User> {
    const findRoomsWithUser = await this.getRoomsByUserSocketId(socketId);
    if (findRoomsWithUser.length === 0) {
      throw 'Cound not find any rooms that contain that user';
    }
    const findUserInRoom = findRoomsWithUser[0].users.find(
      (user) => user.socketId === socketId,
    );
    if (!findUserInRoom) {
      throw 'could not find user in that room';
    }
    return findUserInRoom;
  }

  async removeUserFromAllRooms(socketId: User['socketId']): Promise<void> {
    const rooms = await this.getRoomsByUserSocketId(socketId);
    for (const room of rooms) {
      await this.removeUserFromRoom(socketId, room.name);
    }
  }

  async removeUserFromRoom(
    socketId: User['socketId'],
    roomName: Room['name'],
  ): Promise<void> {
    const room = await this.getRoomIndexByName(roomName);
    this.rooms[room].users = this.rooms[room].users.filter(
      (user) => user.socketId !== socketId,
    );
    if (this.rooms[room].users.length === 0) {
      await this.removeRoom(roomName);
    }
  }

  async getRooms(): Promise<Room[]> {
    return this.rooms;
  }
}
