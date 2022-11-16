import { MakeGenerics, useMatch, useNavigate } from '@tanstack/react-location';
import React, { useEffect } from 'react';
import { User } from '../../shared/interfaces/chat.interface';
import { LoginForm } from '../components/login.form';
import { LoginLayout } from '../layouts/login.layout';

type LoginLocationGenerics = MakeGenerics<{
  LoaderData: {
    user: User;
  };
}>;

function Login() {
  const {
    data: { user },
  } = useMatch<LoginLocationGenerics>();

  const navigate = useNavigate();

  const login = (e: React.FormEvent<HTMLFormElement>) => {
    const formValue = e.target[0].value;
    const newUser = {
      userId: Date.now().toLocaleString().concat(formValue),
      userName: formValue,
    };
    sessionStorage.setItem('user', JSON.stringify(newUser));
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
