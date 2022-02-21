import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { ICategoryForm, ILogin } from 'models/formType';
import { deleteData, postData, putData } from '../utils/fetchData';
import { IAccessToken, IMutation } from 'models/apiType';

export const authMutation = {
  login: ({ options }: IMutation) => {
    return useMutation<IAccessToken, AxiosError, ILogin>(
      (dataForm) => {
        return postData({
          url: '/api/auth/login',
          body: dataForm,
        });
      },
      {
        ...options,
      }
    );
  },
  recoverPass: ({ options }: IMutation) => {
    return useMutation<any, AxiosError, string>(
      (email) => {
        return postData({
          url: 'api/auth/smtpResetPass',
          body: {
            email,
          },
        });
      },
      {
        ...options,
      }
    );
  },
};
