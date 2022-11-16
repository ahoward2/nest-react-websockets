import { Injectable } from '@nestjs/common';
import { User } from '../../shared/interfaces/chat.interface';

@Injectable()
export class UserService {
  private users: User[] = [];

  async addUser(user: User): Promise<void> {
    this.users.push(user);
  }

  async removeUser(socketId: string): Promise<void> {
    this.users = this.users.filter((user) => user.socketId !== socketId);
  }

  async getUserByUserId(userId: string): Promise<Number> {
    const userIndex = this.users.findIndex((user) => user?.userId === userId);
    return userIndex;
  }

  async getUserBySocketId(socketId: string): Promise<Number> {
    const userIndex = this.users.findIndex(
      (user) => user?.socketId === socketId,
    );
    return userIndex;
  }

  async updateUserData(
    socketId: string,
    data: Pick<User, 'userId' | 'userName'>,
  ): Promise<void> {
    const userIndex = await this.getUserBySocketId(socketId);
    if (userIndex !== -1) {
      this.users[`${userIndex}`] = { socketId, ...data };
      console.log('updateUserData: ', JSON.stringify(this.users, null, 2));
    } else {
      await this.addUser({ socketId, ...data });
    }
  }

  async getUsers(): Promise<User[]> {
    return this.users;
  }
}
