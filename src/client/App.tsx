import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { User, Message } from '../shared/interfaces/data.interface';

const socket = io();

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User>({
    userId: Date.now().toLocaleString().concat('Austin'),
    userName: 'Austin',
  });

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem('user') ?? '{}');
    if (!currentUser.userId) {
      const newUser = {
        userId: Date.now().toLocaleString().concat('Austin'),
        userName: 'Austin',
      };
      sessionStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } else {
      setUser(currentUser);
    }

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('events', (e) => {
      setMessages((messages) => [e, ...messages]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('events');
    };
  }, []);

  const sendPing = (e) => {
    console.log(e);
    socket.emit('events', {
      user: {
        userId: user.userId,
        userName: user.userName,
      },
      message: e.target[0].value,
    });
  };

  const determineMessageStyle = (messageUserId: string) => {
    if (messageUserId === user.userId) {
      return 'bg-purple-600 p-4 ml-24 mb-4 rounded';
    } else {
      return 'bg-gray-600 p-4 mr-24 mb-4 rounded';
    }
  };

  return (
    <div className="flex mx-auto w-screen h-screen justify-center bg-gray-900">
      <div className="h-full w-4/12">
        <div className="h-1/6">
          <h1 className="text-purple-300 font-black text-3xl mx-auto">
            Nest React Realtime Chat
          </h1>
          <div className="flex justify-between">
            <p className="text-white">Connected: {'' + isConnected}</p>
            <p className="text-white">
              Current User: {'' + user.userName ?? ''}
            </p>
          </div>
        </div>
        <div className="w-ful flex flex-col-reverse h-4/6 overflow-y-scroll">
          {messages?.map((message, index) => {
            return (
              <div
                key={index}
                className={determineMessageStyle(message.user.userId)}
              >
                <span className="text-gray-400 font-thin">
                  {message.user.userName}
                </span>
                <p className="text-white">{message.message}</p>
              </div>
            );
          })}
        </div>
        <div className="h-1/6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendPing(e);
            }}
            className="w-full flex flex-col"
          >
            <textarea id="minput"></textarea>
            <input type="submit" value="send" className="text-white"></input>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
