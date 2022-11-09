import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { User, Message } from '../shared/interfaces/chat.interface';
import { Header } from './components/header';
import { LoginForm } from './components/login.form';
import { MessageForm } from './components/message.form';
import { Messages } from './components/messages';
import { ChatLayout } from './layouts/chat.layout';
import { LoginLayout } from './layouts/login.layout';

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

  const login = (e: React.FormEvent<HTMLFormElement>) => {
    const formValue = e.target[0].value;
    const newUser = {
      userId: Date.now().toLocaleString().concat(formValue),
      userName: formValue,
    };
    sessionStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
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
  return (
    <>
      {user && user.userId ? (
        <ChatLayout>
          <Header user={user} isConnected={isConnected}></Header>
          <Messages user={user} messages={messages}></Messages>
          <MessageForm sendMessage={sendMessage}></MessageForm>
        </ChatLayout>
      ) : (
        <LoginLayout>
          <LoginForm login={login}></LoginForm>
        </LoginLayout>
      )}
    </>
  );
}

export default App;
