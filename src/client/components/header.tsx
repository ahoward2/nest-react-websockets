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
    <div className="h-1/6">
      <h1 className="mx-auto text-5xl font-black text-violet-500">
        Realtime Chat
      </h1>
      <div className="flex justify-between">
        <p className="text-white">Connected: {'' + isConnected}</p>
        <p className="text-white">Current User: {'' + user.userName ?? ''}</p>
      </div>
    </div>
  );
};
