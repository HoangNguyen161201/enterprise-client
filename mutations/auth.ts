import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { ICategoryForm, ILogin, IResetPass } from 'models/formType';
import { deleteData, postData, putData } from '../utils/fetchData';
import { IAccessToken, IMutation } from 'models/apiType';

interface IResetPassWord extends IResetPass {
  activeToken: string
}

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
  
  resetPass: ({ options }: {options: any}) => {
    return useMutation<any, AxiosError, IResetPassWord>(
      (data) => {
        return postData({
          url: '/api/auth/resetPassword',
          body: data,
        });
      },
      {
        ...options,
      }
    );
  },
  
};
