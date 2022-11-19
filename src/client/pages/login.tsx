import { MakeGenerics, useMatch, useNavigate } from '@tanstack/react-location';
import React, { useEffect } from 'react';
import { User } from '../../shared/interfaces/chat.interface';
import { LoginForm } from '../components/login.form';
import { LoginLayout } from '../layouts/login.layout';

type LoginLocationGenerics = MakeGenerics<{
  LoaderData: {
    user: Pick<User, 'userId' | 'userName'> | '';
  };
}>;

function Login() {
  const {
    data: { user },
  } = useMatch<LoginLocationGenerics>();

  const navigate = useNavigate();

  const login = (e: React.FormEvent<HTMLFormElement>) => {
    const userFormValue = e.target[0].value;
    const roomFormValue = e.target[1].value;
    const newUser = {
      userId: Date.now().toLocaleString().concat(userFormValue),
      userName: userFormValue,
    };
    sessionStorage.setItem('user', JSON.stringify(newUser));
    sessionStorage.setItem('room', roomFormValue);
    navigate({ to: '/chat', replace: true });
  };

  useEffect(() => {
    if (user) {
      navigate({ to: '/chat', replace: true });
    }
  }, []);

  return (
    <LoginLayout>
      <LoginForm login={login}></LoginForm>
    </LoginLayout>
  );
}

export default Login;
