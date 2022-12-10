import React, { useEffect, useState } from 'react';
import { MakeGenerics, useMatch, useNavigate } from '@tanstack/react-location';
import { User } from '../../shared/interfaces/chat.interface';
import { LoginForm, LoginFormInputs } from '../components/login.form';
import { Rooms } from '../components/rooms';
import { LoginLayout } from '../layouts/login.layout';
import { useRoomsQuery } from '../lib/room';
import { getUser } from '../lib/user';

function Login() {
  const {
    data: { user, roomName },
  } = useMatch<LoginLocationGenerics>();

  const [joinRoomSelection, setJoinRoomSelection] = useState<string>('');

  const { data: rooms, isLoading: roomsLoading } = useRoomsQuery();

  const navigate = useNavigate();

  const handleRoomSelection = (data: LoginFormInputs) => {
    if (joinRoomSelection !== '') {
      sessionStorage.setItem('room', joinRoomSelection);
    } else if (data.roomName) {
      sessionStorage.setItem('room', data.roomName);
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
      <Rooms
        rooms={rooms ?? []}
        selectionHandler={setJoinRoomSelection}
        selectedRoom={joinRoomSelection}
        isLoading={roomsLoading}
      ></Rooms>
      <LoginForm
        defaultUser={user?.userName}
        disableNewRoom={joinRoomSelection !== ''}
        onSubmitSecondary={handleRoomSelection}
      ></LoginForm>
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
