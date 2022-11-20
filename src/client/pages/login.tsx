import { MakeGenerics, useMatch, useNavigate } from '@tanstack/react-location';
import React, { useEffect, useState } from 'react';
import { User } from '../../shared/interfaces/chat.interface';
import { LoginForm } from '../components/login.form';
import { Rooms } from '../components/rooms';
import { LoginLayout } from '../layouts/login.layout';
import { useRoomsQuery } from '../lib/room';

type LoginLocationGenerics = MakeGenerics<{
  LoaderData: {
    user: Pick<User, 'userId' | 'userName'> | '';
  };
}>;

function Login() {
  const {
    data: { user },
  } = useMatch<LoginLocationGenerics>();

  const [joinRoomSelection, setJoinRoomSelection] = useState<string>('');

  const navigate = useNavigate();

  const { data: rooms } = useRoomsQuery();

  const selectExistingRoom = (roomName: string) => {
    setJoinRoomSelection(roomName);
  };

  const login = (e: React.FormEvent<HTMLFormElement>) => {
    const userFormValue = e.target[0].value;
    const roomFormValue = e.target[1].value;
    const newUser = {
      userId: Date.now().toLocaleString().concat(userFormValue),
      userName: userFormValue,
    };
    sessionStorage.setItem('user', JSON.stringify(newUser));
    if (joinRoomSelection !== '') {
      sessionStorage.setItem('room', joinRoomSelection);
    } else {
      sessionStorage.setItem('room', roomFormValue);
    }
    navigate({ to: '/chat', replace: true });
  };

  useEffect(() => {
    if (user) {
      navigate({ to: '/chat', replace: true });
    }
  }, []);

  return (
    <LoginLayout>
      <LoginForm
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

export default Login;
