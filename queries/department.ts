import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { getData } from '../utils';

export const getDetailDepartment = (id: string, accessToken: string) => {
  return useQuery<any, AxiosError>(
    ['department', id],
    async () => {
      return await getData({ url: `/api/departments/${id}`, token: accessToken });
    },
    {
      enabled: !!accessToken,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
};

export const getAllDepartments = (accessToken: string) => {
  return useQuery<any, AxiosError>(
    ['departments'],
    async () => {
      return await getData({ url: `/api/departments`, token: accessToken });
    },
    {
      enabled: !!accessToken,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
};
