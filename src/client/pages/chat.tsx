import { MakeGenerics, useMatch, useNavigate } from '@tanstack/react-location';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  User,
  Message,
  ServerToClientEvents,
  ClientToServerEvents,
} from '../../shared/interfaces/chat.interface';
import { Header } from '../components/header';
import { UserList } from '../components/list';
import { MessageForm } from '../components/message.form';
import { Messages } from '../components/messages';
import { ChatLayout } from '../layouts/chat.layout';

type ChatLocationGenerics = MakeGenerics<{
  LoaderData: {
    user: Pick<User, 'userId' | 'userName'>;
  };
}>;

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

function Chat() {
  const {
    data: { user },
  } = useMatch<ChatLocationGenerics>();

  const navigate = useNavigate();

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<Message[]>([]);
  const [toggleUserList, setToggleUserList] = useState<boolean>(false);

  const { data: connectedUsers } = useQuery({
    queryKey: ['connected_users'],
    queryFn: async () => axios.get('/api/current-users'),
    refetchInterval: 60000,
    enabled: isConnected,
  });

  useEffect(() => {
    if (!user) {
      navigate({ to: '/', replace: true });
    } else {
      socket.on('connect', () => {
        console.log(socket.id);
        socket.emit('set_client_data', { socketId: socket.id, ...user });
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('chat', (e) => {
        setMessages((messages) => [e, ...messages]);
      });
    }

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chat');
    };
  }, []);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    if (user && socket) {
      socket.emit('chat', {
        user: {
          userId: user.userId,
          userName: user.userName,
          socketId: socket.id,
        },
        timeSent: new Date(Date.now()).toLocaleString('en-US'),
        message: e.target[0].value,
      });
    }
  };
  return (
    <>
      {user && user.userId ? (
        <ChatLayout>
          <Header
            user={user}
            isConnected={isConnected}
            users={connectedUsers?.data ?? []}
            handleUsersClick={() =>
              setToggleUserList((toggleUserList) => !toggleUserList)
            }
            title={toggleUserList ? 'Connected Users' : 'Chat'}
          ></Header>
          {toggleUserList ? (
            <UserList users={connectedUsers?.data ?? []}></UserList>
          ) : (
            <Messages user={user} messages={messages}></Messages>
          )}
          <MessageForm sendMessage={sendMessage}></MessageForm>
        </ChatLayout>
      ) : (
        <></>
      )}
    </>
  );
}

export default Chat;
