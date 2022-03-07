import { AxiosError } from 'axios';
import { IAvatar, IMutation, IUser } from 'models/apiType';
import { IUserForm } from 'models/formType';
import { useMutation } from 'react-query';
import { deleteData, postData, putData } from '../utils/fetchData';

export const EmplMutation = {
  deleteMany: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, { users: string[] }>(
      ({ users }) => {
        dataUserRefetch && dataUserRefetch();
        return postData({
          url: `/api/users/delete-many`,
          body: {
            users,
          },
          token,
        });
      },
      {
        ...options,
      }
    );
  },
  add: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, IUserForm>(
      (dataForm) => {
        dataUserRefetch && dataUserRefetch();
        return postData({
          url: '/api/users',
          body: dataForm,
          token,
        });
      },
      {
        ...options,
      }
    );
  },

  addMany: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, { users: Partial<IUser>[] }>(
      ({ users }) => {
        dataUserRefetch && dataUserRefetch();
        return postData({
          url: '/api/users/add-many',
          body: {
            users,
          },
          token,
        });
      },
      {
        ...options,
      }
    );
  },

  update: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, { user: IUser }>(
      ({ user }) => {
        dataUserRefetch && dataUserRefetch();
        return putData({
          url: `/api/users/${user.id}`,
          body: {
            ...user,
          },
          token,
        });
      },
      {
        ...options,
      }
    );
  },

  updateAvatar: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, { user: IUser; avatar: IAvatar }>(
      ({ user, avatar }) => {
        dataUserRefetch && dataUserRefetch();
        return putData({
          url: `/api/users/avatar/${user._id}`,
          body: {
            avatar,
          },
          token,
        });
      },
      {
        ...options,
      }
    );
  },

  delete: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, Partial<IUserForm>>(
      ({ id }) => {
        dataUserRefetch && dataUserRefetch();
        return deleteData({
          url: `/api/users/${id}`,
          token,
        });
      },
      {
        ...options,
      }
    );
  },
};
