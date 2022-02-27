import { AxiosError } from 'axios';
import { IDetailUser, IUser } from 'models/apiType';
import { useQuery } from 'react-query';
import { getData } from '../utils/fetchData';

export const getCurrentUser = (initialData?: IDetailUser ) => {
  return useQuery<IDetailUser, AxiosError>(
    'accessToken',
    async () => {
      return await getData({ url: '/api/auth/accesstoken' });
    },
    {
      enabled: false,
      cacheTime: 14 * 60 * 1000,
      initialData: initialData
    }
  );
};
