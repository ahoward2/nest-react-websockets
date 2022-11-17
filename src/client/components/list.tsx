import React from 'react';
import { User } from '../../shared/interfaces/chat.interface';

export const UserList = ({ users }: { users: User[] }) => {
  return (
    <div className="flex h-4/6 w-full flex-col-reverse overflow-y-scroll">
      {users.map((user, index) => {
        return (
          <div key={index} className="mb-4 rounded px-4 py-2">
            <p className="text-white">{user.userName}</p>
          </div>
        );
      })}
    </div>
  );
};
