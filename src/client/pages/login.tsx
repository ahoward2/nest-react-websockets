import React, { useEffect, useState } from 'react';
import { MakeGenerics, useMatch, useNavigate } from '@tanstack/react-location';
import { User } from '../../shared/interfaces/chat.interface';
import { LoginForm } from '../components/login.form';
import { Rooms } from '../components/rooms';
import { LoginLayout } from '../layouts/login.layout';
import { useRoomsQuery } from '../lib/room';
import { generateUserId, getUser, setUser } from '../lib/user';

function Login() {
  const {
    data: { user, roomName },
  } = useMatch<LoginLocationGenerics>();

  const [joinRoomSelection, setJoinRoomSelection] = useState<string>('');

  const navigate = useNavigate();

  const { data: rooms, isLoading: roomsLoading } = useRoomsQuery();

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    const userFormValue = e.target[0].value;
    const roomFormValue = e.target[1].value;
    const newUser = {
      userId: generateUserId(userFormValue),
      userName: userFormValue,
    };
    setUser({ id: newUser.userId, name: newUser.userName });
    if (joinRoomSelection !== '') {
      sessionStorage.setItem('room', joinRoomSelection);
    } else {
      sessionStorage.setItem('room', roomFormValue);
    }
    navigate({ to: '/chat' });
  };

  useEffect(() => {
    if (user?.userId && roomName) {
      navigate({ to: '/chat', replace: true });
    }
  }, []);

  return (
    <LoginLayout>
      <LoginForm
        defaultUser={user?.userName}
        disableNewRoom={joinRoomSelection !== ''}
        login={login}
      ></LoginForm>

      <Rooms
        rooms={rooms ?? []}
        selectionHandler={setJoinRoomSelection}
        selectedRoom={joinRoomSelection}
        isLoading={roomsLoading}
      ></Rooms>
    </LoginLayout>
  );
}

export const loader = async () => {
  const user = getUser();
  return {
    user: user,
    roomName: sessionStorage.getItem('room'),
  };
};

type LoginLocationGenerics = MakeGenerics<{
  LoaderData: {
    user: Pick<User, 'userId' | 'userName'>;
    roomName: string;
  };
}>;

export default Login;
