import React, { useState, useEffect } from 'react';
import { MakeGenerics, useMatch, useNavigate } from '@tanstack/react-location';
import { io, Socket } from 'socket.io-client';
import {
  User,
  Message,
  ServerToClientEvents,
  ClientToServerEvents,
  KickUser,
  JoinRoom,
} from '../../shared/interfaces/chat.interface';
import { Header } from '../components/header';
import { UserList } from '../components/list';
import { MessageForm } from '../components/message.form';
import { Messages, ClientMessage } from '../components/messages';
import { ChatLayout } from '../layouts/chat.layout';
import { unsetRoom, useRoomQuery } from '../lib/room';
import { getUser } from '../lib/user';
import {
  ChatMessageSchema,
  JoinRoomSchema,
  KickUserSchema,
} from '../../shared/schemas/chat.schema';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
  autoConnect: false,
});

function Chat() {
  const {
    data: { user, roomName },
  } = useMatch<ChatLocationGenerics>();

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isJoinedRoom, setIsJoinedRoom] = useState(false);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [toggleUserList, setToggleUserList] = useState<boolean>(false);

  const { data: room, refetch: roomRefetch } = useRoomQuery(
    roomName,
    isConnected,
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !roomName) {
      navigate({ to: '/', replace: true });
    } else {
      socket.on('connect', () => {
        const joinRoom: JoinRoom = {
          roomName,
          user: { socketId: socket.id, ...user },
          eventName: 'join_room',
        };
        JoinRoomSchema.parse(joinRoom);
        const joinTimeout = setTimeout(() => {
          // if server doesn't acknowledge joined room in 10 seconds, redirect to login
          leaveRoom();
        }, 10000);
        socket.emit('join_room', joinRoom, (joined) => {
          if (joined) {
            clearTimeout(joinTimeout);
            setIsJoinedRoom(true);
          }
        });
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('chat', (e) => {
        if (e.user.userId !== user.userId) {
          setMessages((messages) => [{ ...e, delivered: true }, ...messages]);
        }
      });

      socket.on('kick_user', (e) => {
        if (e.userToKick.socketId === socket.id) {
          leaveRoom();
        }
      });

      socket.connect();
    }
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chat');
      socket.off('kick_user');
    };
  }, []);

  const leaveRoom = () => {
    socket.disconnect();
    unsetRoom();
    navigate({ to: '/', replace: true });
  };

  const sendMessage = (message: string) => {
    if (user && socket && roomName) {
      const chatMessage: Message = {
        user: {
          userId: user.userId,
          userName: user.userName,
          socketId: socket.id,
        },
        timeSent: Date.now(),
        message,
        roomName: roomName,
        eventName: 'chat',
      };
      ChatMessageSchema.parse(chatMessage);
      setMessages((messages) => [
        { ...chatMessage, delivered: false },
        ...messages,
      ]);
      socket.emit('chat', chatMessage, (delivered) => {
        if (delivered) {
          setMessages((messages) => {
            const previousMessageIndex = messages.findIndex((mes) => {
              if (
                mes.user.userId === user.userId &&
                mes.timeSent === chatMessage.timeSent
              ) {
                return mes;
              }
            });
            if (previousMessageIndex === -1) {
              throw 'Previously sent message not found to update delivered status';
            }
            messages[previousMessageIndex] = {
              ...messages[previousMessageIndex],
              delivered: true,
            };
            return [...messages];
          });
        }
      });
    }
  };

  const kickUser = (userToKick: User) => {
    if (!room) {
      throw 'No room';
    }
    if (!user) {
      throw 'No current user';
    }
    const kickUserData: KickUser = {
      user: { ...user, socketId: socket.id },
      userToKick: userToKick,
      roomName: room.name,
      eventName: 'kick_user',
    };
    KickUserSchema.parse(kickUserData);
    socket.emit('kick_user', kickUserData, (complete) => {
      if (complete) {
        roomRefetch();
      }
    });
  };

  return (
    <>
      {user?.userId && roomName && room && isJoinedRoom && (
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
            <UserList
              room={room}
              currentUser={{ socketId: socket.id, ...user }}
              kickHandler={kickUser}
            ></UserList>
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
