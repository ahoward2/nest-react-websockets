import React from 'react';
import { User } from '../../shared/interfaces/chat.interface';

export const Header = ({
  user,
  isConnected,
  users,
  handleUsersClick,
  title,
}: {
  user: User;
  isConnected: boolean;
  users: User[];
  title: string;
  handleUsersClick: () => void;
}) => {
  return (
    <header className="flex h-1/6 flex-col">
      <div className="flex items-center justify-between py-6">
        <h1 className="text-4xl font-black text-violet-500">Realtime Chat</h1>
        <div className="flex h-8 items-center rounded-xl bg-slate-800 px-4">
          <span className="mr-1 text-lg text-white">{user.userName ?? ''}</span>
          <span className="ml-1">{isConnected ? '🟢' : '🔴'}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <h3 className="text-xl font-black text-white">{title}</h3>
        <button
          onClick={() => handleUsersClick()}
          className="flex h-8 items-center rounded-xl bg-slate-800 px-4"
        >
          <span className="mr-1 text-lg text-white">{'👨‍💻'}</span>
          <span className="ml-1 text-white">{users.length}</span>
        </button>
      </div>
    </header>
  );
};
