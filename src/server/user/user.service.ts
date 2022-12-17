import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  private userStore: User[] = [];

  async addUser(user: User) {
    const findUser = await this.findUserById(user.userId);
    if (findUser === 'Not Exists') {
      const newUser = new User(user);
      this.userStore.push(newUser);
    }
  }

  async findUserById(userId: string): Promise<User | 'Not Exists'> {
    const searchForUserIndex = await this.findUserIndexById(userId);
    if (searchForUserIndex === -1) {
      return 'Not Exists';
    }
    return this.userStore[searchForUserIndex];
  }

  async findUserIndexById(userId: string): Promise<number> {
    const searchForUserIndex = this.userStore.findIndex(
      (user) => user.userId === userId,
    );
    return searchForUserIndex;
  }

  async removeUserById(userId: string): Promise<void> {
    const findUserIndex = await this.findUserIndexById(userId);
    if (findUserIndex == -1) {
      throw 'User does not exist so cannot be removed from the store';
    }
    this.userStore.splice(findUserIndex, findUserIndex);
  }
}
