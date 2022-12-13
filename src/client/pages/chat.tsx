// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { MakeGenerics, useMatch, useNavigate } from '@tanstack/react-location';
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
import { unsetRoom, useRoomQuery } from '../lib/room';
import { getUser } from '../lib/user';
import {
  ChatMessageSchema,
  JoinRoomSchema,
} from '../../shared/schemas/chat.schema';
import axios from 'axios';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
  autoConnect: false,
});

function Chat() {
  const {
    data: { user, roomName },
  } = useMatch<ChatLocationGenerics>();

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<Message[]>([]);
  const [toggleUserList, setToggleUserList] = useState<boolean>(false);

  const { data: room } = useRoomQuery(roomName, isConnected);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !roomName) {
      navigate({ to: '/', replace: true });
    } else {
      socket.on('connect', () => {
        const joinRoom = {
          roomName,
          user: { socketId: socket.id, ...user },
        };
        JoinRoomSchema.parse(joinRoom);
        socket.emit('join_room', joinRoom);
        setIsConnected(true);
        axios.interceptors.request.use((request) => {
          request.headers['user'] = JSON.stringify({
            socketId: socket.id,
            ...user,
          });
          return request;
        });
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('chat', (e) => {
        setMessages((messages) => [e, ...messages]);
      });

      socket.connect();
    }
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chat');
    };
  }, []);

  const leaveRoom = () => {
    socket.disconnect();
    unsetRoom();
    navigate({ to: '/', replace: true });
  };

  const sendMessage = (message: string) => {
    if (user && socket && roomName) {
      const chatMessage = {
        user: {
          userId: user.userId,
          userName: user.userName,
          socketId: socket.id,
        },
        timeSent: new Date(Date.now()).toLocaleString('en-US'),
        message,
        roomName: roomName,
      };
      ChatMessageSchema.parse(chatMessage);
      socket.emit('chat', chatMessage);
    }
  };
  return (
    <>
      {user?.userId && roomName && room && (
        <ChatLayout>
          <Header
            isConnected={isConnected}
            users={room?.users ?? []}
            roomName={roomName}
            handleUsersClick={() =>
              setToggleUserList((toggleUserList) => !toggleUserList)
            }
            handleLeaveRoom={() => leaveRoom()}
          ></Header>
          {toggleUserList ? (
            <UserList room={room}></UserList>
          ) : (
            <Messages user={user} messages={messages}></Messages>
          )}
          <MessageForm sendMessage={sendMessage}></MessageForm>
        </ChatLayout>
      )}
    </>
  );
}

export const loader = async () => {
  const user = getUser();
  return {
    user: user,
    roomName: sessionStorage.getItem('room'),
  };
};

type ChatLocationGenerics = MakeGenerics<{
  LoaderData: {
    user: Pick<User, 'userId' | 'userName'>;
    roomName: string;
  };
}>;

export default Chat;
