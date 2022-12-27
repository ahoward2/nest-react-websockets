import React from 'react';
import { Message, User } from '../../shared/interfaces/chat.interface';
export type ClientMessage = Message & { delivered: boolean };

const determineMessageStyle = (
  user: Pick<User, 'userId' | 'userName'>,
  messageUserId: Message['user']['userId'],
) => {
  if (user && messageUserId === user.userId) {
    return {
      message: 'bg-slate-500 p-4 ml-24 rounded break-words',
      sender: 'ml-24 pl-4',
    };
  } else {
    return {
      message: 'bg-slate-800 p-4 mr-24 rounded break-words',
      sender: 'mr-24 pl-4',
    };
  }
};

export const Messages = ({
  user,
  messages,
}: {
  user: Pick<User, 'userId' | 'userName'>;
  messages: ClientMessage[];
}) => {
  return (
    <div className="flex h-4/6 w-full flex-col-reverse overflow-y-scroll">
      {messages?.map((message, index) => {
        return (
          <div key={index + message.timeSent} className="mb-4">
            <div
              className={
                determineMessageStyle(user, message.user.userId).sender
              }
            >
              <span className="text-sm text-gray-400">
                {message.user.userName}
              </span>
              <span className="text-sm text-gray-400">{' ' + '•' + ' '}</span>
              <span className="text-sm text-gray-400">
                {new Date(message.timeSent).toLocaleString()}
              </span>
            </div>
            <div
              className={
                determineMessageStyle(user, message.user.userId).message
              }
            >
              <p className="text-white">{message.message}</p>
            </div>
            {user && message.user.userId === user.userId && (
              <p className="text-right text-xs text-gray-400">
                {message.delivered ? 'Delivered' : 'Not delivered'}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
