import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { StringSchema } from 'yup';
import { IDepartments, IDetailDepartment, IResUsersNotDepartments } from '../models/apiType';
import { getData } from '../utils';

export const getDetailDepartment = (
  id: string,
  accessToken: string,
  initial?: IDetailDepartment
) => {
  return useQuery<any, AxiosError>(
    ['department', id],
    async () => {
      return await getData({ url: `/api/departments/${id}`, token: accessToken });
    },
    {
      enabled: !!accessToken && !!id,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      initialData: initial,
    }
  );
};

export const getDepartmentByUser = (
  id: string,
  accessToken: string,
  initial: IDetailDepartment
) => {
  return useQuery<any, AxiosError>(
    ['department', id],
    async () => {
      return await getData({ url: `/api/departments/user/${id}`, token: accessToken });
    },
    {
      enabled: !!accessToken && !!id,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      initialData: initial,
    }
  );
};

export const getAllDepartments = (accessToken: string, initial?: IDepartments) => {
  return useQuery<IDepartments, AxiosError>(
    ['departments'],
    async () => {
      return await getData({ url: `/api/departments`, token: accessToken });
    },
    {
      enabled: !!accessToken,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      initialData: initial
    }
  );
};

export const getUsersNotDepartment = (accessToken: string) => {
  return useQuery<IResUsersNotDepartments, AxiosError>(
    ['users', 'not-department'],
    async () => {
      return await getData({ url: `/api/users/not-department`, token: accessToken });
    },
    {
      enabled: !!accessToken,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
};
