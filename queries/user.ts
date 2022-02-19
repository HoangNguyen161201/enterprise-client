import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { IallCategories, IAllUsers, IResUsersRole, IUser } from '../models';
import { getData } from '../utils';


export const getUsersRoleDepartment = (
  role: string,
  hasDepartment: string,
  accessToken: string
) => {
  return useQuery<IResUsersRole, AxiosError>(
    ['users', role, `department-${hasDepartment}`],
    async () => {
      return await getData({
        url: `/api/users/role/${role}?department=${hasDepartment}`,
        token: accessToken,
      });
    },
    {
      enabled: !!accessToken,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
};

export const getallUsers = (accessToken: string, initial?: IAllUsers) => {
  return useQuery<IAllUsers, AxiosError>(
    ['users'],
    async () => {
      return await getData({ url: `/api/users`, token: accessToken });
    },
    {
      enabled: !!accessToken,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      initialData: initial,
    }
  );
};

export const getDetailUser = (
  id: string,
  accessToken: string,
  initial?: IUser
) => {
  return useQuery<any, AxiosError>(
    ['user', id],
    async () => {
      return await getData({ url: `/api/users/${id}`, token: accessToken });
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
