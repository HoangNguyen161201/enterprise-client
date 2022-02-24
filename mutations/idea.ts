import { AxiosError } from 'axios';
import { IMutation, IUser } from 'models/apiType';
import { IIdeaForm, IUserForm } from 'models/formType';
import { useMutation } from 'react-query';
import { deleteData, postData, putData } from '../utils/fetchData';

export const IdeaMutaion = {
  add: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, Partial<IIdeaForm>>(
      (dataForm) => {
        dataUserRefetch && dataUserRefetch();
        return postData({
          url: '/api/ideas',
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
