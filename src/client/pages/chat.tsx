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
    roomName: string;
  };
}>;

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

function Chat() {
  const {
    data: { user, roomName },
  } = useMatch<ChatLocationGenerics>();

  const navigate = useNavigate();

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<Message[]>([]);
  const [toggleUserList, setToggleUserList] = useState<boolean>(false);

  const { data: connectedUsers } = useQuery({
    queryKey: ['rooms', roomName],
    queryFn: async () => axios.get(`/api/rooms/${roomName}`),
    refetchInterval: 60000,
    enabled: isConnected,
  });

  useEffect(() => {
    if (!user || !roomName) {
      navigate({ to: '/', replace: true });
    } else {
      socket.on('connect', () => {
        socket.emit('join_room', {
          roomName,
          user: { socketId: socket.id, ...user },
        });
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
    if (user && socket && roomName) {
      socket.emit('chat', {
        user: {
          userId: user.userId,
          userName: user.userName,
          socketId: socket.id,
        },
        timeSent: new Date(Date.now()).toLocaleString('en-US'),
        message: e.target[0].value,
        roomName: roomName,
      });
    }
  };
  return (
    <>
      {user && user.userId && roomName ? (
        <ChatLayout>
          <Header
            user={user}
            isConnected={isConnected}
            users={connectedUsers?.data?.users ?? []}
            roomName={roomName}
            handleUsersClick={() =>
              setToggleUserList((toggleUserList) => !toggleUserList)
            }
            title={toggleUserList ? 'Connected Users' : 'Chat'}
          ></Header>
          {toggleUserList ? (
            <UserList users={connectedUsers?.data?.users ?? []}></UserList>
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
