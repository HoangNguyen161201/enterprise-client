import { AxiosError } from 'axios';
import { IAvatar, IMutation, IUser } from 'models/apiType';
import { IContactForm, IUserForm } from 'models/formType';
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
};
