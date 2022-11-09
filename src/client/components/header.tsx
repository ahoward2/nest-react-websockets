import React from 'react';
import { User } from '../../shared/interfaces/chat.interface';

export const Header = ({
  user,
  isConnected,
}: {
  user: User;
  isConnected: boolean;
}) => {
  return (
    <div className="flex h-1/6 items-center justify-between">
      <h1 className="text-5xl font-black text-violet-500">Realtime Chat</h1>
      <div className="flex h-8 items-center rounded-xl bg-slate-800 px-4">
        <span className="mr-1 text-lg text-white">{user.userName ?? ''}</span>
        <span className="ml-1">{isConnected ? '🟢' : '🔴'}</span>
      </div>
    </div>
  );
};
