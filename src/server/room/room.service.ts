import { Injectable } from '@nestjs/common';
import { Room } from '../entities/room.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class RoomService {
  private rooms: Room[] = [];

  async addRoom(roomName: string, host: User): Promise<void> {
    const room = await this.getRoomIndexByName(roomName);
    if (room === -1) {
      await this.rooms.push(
        new Room({ name: roomName, host: host, users: [host] }),
      );
    }
  }

  async removeRoom(roomName: string): Promise<void> {
    const findRoom = await this.getRoomIndexByName(roomName);
    if (findRoom !== -1) {
      this.rooms = this.rooms.filter((room) => room.name !== roomName);
    }
  }

  async getRoomHost(hostName: string): Promise<User> {
    const roomIndex = await this.getRoomIndexByName(hostName);
    return this.rooms[roomIndex].host;
  }

  async getRoomIndexByName(roomName: string): Promise<number> {
    const roomIndex = this.rooms.findIndex((room) => room?.name === roomName);
    return roomIndex;
  }

  async getRoomByName(roomName: string): Promise<Room | 'Not Exists'> {
    const findRoom = this.rooms.find((room) => room.name === roomName);
    if (!findRoom) {
      return 'Not Exists';
    }
    return findRoom;
  }

  async addUserToRoom(roomName: string, user: User): Promise<void> {
    const roomIndex = await this.getRoomIndexByName(roomName);
    const newUser = new User({
      userId: user.userId,
      userName: user.userName,
      socketId: user.socketId,
    });
    if (roomIndex !== -1) {
      this.rooms[roomIndex].users.push(newUser);
      const host = await this.getRoomHost(roomName);
      if (host.userId === newUser.userId) {
        this.rooms[roomIndex].host.socketId = newUser.socketId;
      }
    } else {
      await this.addRoom(roomName, user);
    }
  }

  async getRoomsByUserSocketId(socketId: string): Promise<Room[]> {
    const filteredRooms = this.rooms.filter((room) => {
      const found = room.users.find((user) => user.socketId === socketId);
      if (found) {
        return found;
      }
    });
    return filteredRooms;
  }

  async getFirstInstanceOfUser(socketId: string): Promise<User> {
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

  async removeUserFromAllRooms(socketId: string): Promise<void> {
    const rooms = await this.getRoomsByUserSocketId(socketId);
    for (const room of rooms) {
      await this.removeUserFromRoom(socketId, room.name);
    }
  }

  async removeUserFromRoom(socketId: string, roomName: string): Promise<void> {
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
