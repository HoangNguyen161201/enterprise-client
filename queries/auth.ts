import { useQuery } from 'react-query';
import { getData } from '../utils/fetchData';

export const getCurrentUser = () => {
  return useQuery('accessToken', () => {
    return getData({url: '/api/auth/accesstoken'});
  }, {
      enabled: false,
      cacheTime: 14 * 60 * 1000
  });
};


