import { User } from '../../shared/interfaces/chat.interface';

export const setUser = ({
  userId,
  userName,
}: Pick<User, 'userId' | 'userName'>) => {
  sessionStorage.setItem('userId', userId);
  sessionStorage.setItem('userName', userName);
};

export const unsetUser = () => {
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('userName');
};

export const getUser = () => {
  const userId = sessionStorage.getItem('userId');
  const userName = sessionStorage.getItem('userName');
  return {
    userId,
    userName,
  };
};

export const generateUserId = (userName: User['userName']) => {
  return Date.now().toLocaleString().concat(userName);
};
