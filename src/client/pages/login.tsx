import { MakeGenerics, useMatch, useNavigate } from '@tanstack/react-location';
import React, { useEffect, useState } from 'react';
import { User } from '../../shared/interfaces/chat.interface';
import { LoginForm } from '../components/login.form';
import { Rooms } from '../components/rooms';
import { LoginLayout } from '../layouts/login.layout';
import { useRoomsQuery } from '../lib/room';
import { getUser, setUser } from '../lib/user';

type LoginLocationGenerics = MakeGenerics<{
  LoaderData: {
    user: Pick<User, 'userId' | 'userName'>;
    roomName: string;
  };
}>;

function Login() {
  const {
    data: { user, roomName },
  } = useMatch<LoginLocationGenerics>();

  const [joinRoomSelection, setJoinRoomSelection] = useState<string>('');

  const navigate = useNavigate();

  const { data: rooms } = useRoomsQuery();

  const selectExistingRoom = (roomName: string) => {
    setJoinRoomSelection(roomName);
  };

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    const userFormValue = e.target[0].value;
    const roomFormValue = e.target[1].value;
    const newUser = {
      userId: Date.now().toLocaleString().concat(userFormValue),
      userName: userFormValue,
    };
    await setUser({ id: newUser.userId, name: newUser.userName });
    if (joinRoomSelection !== '') {
      await sessionStorage.setItem('room', joinRoomSelection);
    } else {
      await sessionStorage.setItem('room', roomFormValue);
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
      {rooms ? (
        <Rooms
          rooms={rooms}
          selectionHandler={selectExistingRoom}
          selectedRoom={joinRoomSelection}
        ></Rooms>
      ) : (
        <></>
      )}
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

export default Login;
