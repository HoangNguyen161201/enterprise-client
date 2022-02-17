import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { IDepartment, IUser, IDetailDepartment } from '../models/apiType';
import { getData } from '../utils';

//Interface
interface IResUsersNotDepartments {
  staffs?: IUser[],
  QACoordinators?: IUser[],
  departmentManagers?: IUser[],
  [index: string]: any
}

export const getDetailDepartment = (id: string, accessToken: string, initial: IDetailDepartment) => {
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
      initialData: initial
    }
  );
};

export const getAllDepartments = (accessToken: string) => {
  return useQuery<IDepartment, AxiosError>(
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
