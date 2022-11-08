import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { User, Message } from '../shared/interfaces/chat.interface';

const socket = io();

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem('user') ?? '{}');
    if (currentUser.userId) {
      setUser(currentUser);
    }

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('chat', (e) => {
      setMessages((messages) => [e, ...messages]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chat');
    };
  }, []);

  const login = (e) => {
    const formValue = e.target[0].value;
    const newUser = {
      userId: Date.now().toLocaleString().concat(formValue),
      userName: formValue,
    };
    sessionStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const sendPing = (e) => {
    if (user) {
      socket.emit('chat', {
        user: {
          userId: user.userId,
          userName: user.userName,
        },
        dateTime: new Date(Date.now()).toLocaleString('en-US'),
        message: e.target[0].value,
      });
    }
  };

  const determineMessageStyle = (messageUserId: string) => {
    if (user && messageUserId === user.userId) {
      return 'bg-violet-900 p-4 ml-24 mb-4 rounded';
    } else {
      return 'bg-slate-700 p-4 mr-24 mb-4 rounded';
    }
  };

  return (
    <div className="mx-auto flex h-screen w-screen justify-center bg-gray-900">
      {user && user.userId ? (
        <div className="h-full w-4/12">
          <div className="h-1/6">
            <h1 className="mx-auto text-5xl font-black text-violet-500">
              Realtime Chat
            </h1>
            <div className="flex justify-between">
              <p className="text-white">Connected: {'' + isConnected}</p>
              <p className="text-white">
                Current User: {'' + user.userName ?? ''}
              </p>
            </div>
          </div>
          <div className="w-ful flex h-4/6 flex-col-reverse overflow-y-scroll">
            {messages?.map((message, index) => {
              return (
                <div
                  key={index}
                  className={determineMessageStyle(message.user.userId)}
                >
                  <span className="text-sm text-gray-400">
                    {message.user.userName}
                  </span>
                  <span className="text-sm text-gray-400">
                    {' ' + '•' + ' '}
                  </span>
                  <span className="text-sm text-gray-400">
                    {message.dateTime}
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
                e.currentTarget.reset();
              }}
              className="flex w-full appearance-none flex-col outline-none"
            >
              <textarea
                id="minput"
                placeholder="Message"
                className="mb-2 rounded-md border border-slate-400 bg-gray-800 text-white placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              ></textarea>
              <input
                type="submit"
                value="send"
                className="mb-2 rounded-md bg-violet-500 text-white placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              ></input>
            </form>
          </div>
        </div>
      ) : (
        <div className="my-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login(e);
            }}
            className="flex h-127 w-127 items-center justify-center rounded-full border border-violet-700 ring-2 ring-violet-400"
          >
            <input
              type="text"
              id="login"
              placeholder="Name"
              className="mx-2 h-12 rounded-md border border-slate-400 bg-gray-800 text-white placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            ></input>
            <button
              type="submit"
              className="mx-2 flex h-12 w-12 items-center justify-center rounded-full bg-violet-700 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
