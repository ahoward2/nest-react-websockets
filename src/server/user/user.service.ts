import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  private users: User[] = [];

  async addUser(user: User) {
    const findUser = await this.getUserById(user.userId);
    if (findUser === 'Not Exists') {
      const newUser = new User(user);
      this.users.push(newUser);
    }
  }

  async getUserById(userId: User['userId']): Promise<User | 'Not Exists'> {
    const searchForUserIndex = await this.getUserIndexById(userId);
    if (searchForUserIndex === -1) {
      return 'Not Exists';
    }
    return this.users[searchForUserIndex];
  }

  async getUserIndexById(userId: User['userId']): Promise<number> {
    const searchForUserIndex = this.users.findIndex(
      (user) => user.userId === userId,
    );
    return searchForUserIndex;
  }

  async removeUserById(userId: User['userId']): Promise<void> {
    const findUserIndex = await this.getUserIndexById(userId);
    if (findUserIndex == -1) {
      throw 'User does not exist so cannot be removed from the store';
    }
    this.users.splice(findUserIndex, findUserIndex);
  }
}
