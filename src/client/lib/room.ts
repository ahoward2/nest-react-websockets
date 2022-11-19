import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Room } from '../../shared/interfaces/chat.interface';

export const useRoomQuery = (roomName, isConnected) => {
  const query = useQuery({
    queryKey: ['rooms', roomName],
    queryFn: (): Promise<Room> =>
      axios.get(`/api/rooms/${roomName}`).then((response) => response.data),
    refetchInterval: 60000,
    enabled: isConnected,
  });
  return query;
};
