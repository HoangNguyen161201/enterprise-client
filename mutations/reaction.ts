import { AxiosError } from 'axios';
import { IMutation } from 'models/apiType';
import { IReactionForm } from 'models/formType';
import { useMutation } from 'react-query';
import { postData } from '../utils/fetchData';

export const IReactionMutaion = {
  add: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, IReactionForm>(
      (dataForm) => {
        dataUserRefetch && dataUserRefetch();
        return postData({
          url: '/api/reactions',
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
