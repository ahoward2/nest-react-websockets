export const setUser = ({ id, name }: { id: string; name: string }) => {
  sessionStorage.setItem('userId', id);
  sessionStorage.setItem('userName', name);
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
