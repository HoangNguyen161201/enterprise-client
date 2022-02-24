import { AxiosError } from 'axios';
import { IMutation } from 'models/apiType';
import { IIdeaForm } from 'models/formType';
import { useMutation } from 'react-query';
import { deleteData, getData, postData } from '../utils/fetchData';

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

  delete: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, {idea_id: string}>(
      ({idea_id}) => {
        dataUserRefetch && dataUserRefetch();
        return deleteData({
          url: `/api/ideas/${idea_id}`,
          token,
        });
      },
      {
        ...options,
      }
    );
  },
};
