import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { getData } from '../utils/fetchData';

export const getCurrentUser = () => {
  return useQuery <any, AxiosError>(
    'accessToken',
    async () => {
      return await getData({ url: '/api/auth/accesstoken' });
    },
    {
      enabled: false,
      cacheTime: 14 * 60 * 1000,
    }
  );
};
