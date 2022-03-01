import { AxiosError } from 'axios';
import { IMutation } from 'models/apiType';
import { IIdeaForm } from 'models/formType';
import { useMutation } from 'react-query';
import { deleteData, getData, postData, putData } from '../utils/fetchData';

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

  update: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, Partial<IIdeaForm>>(
      ({_id, ...dataForm}) => {
        dataUserRefetch && dataUserRefetch();
        return putData({
          url: `/api/ideas/${_id}`,
          body: dataForm,
          token,
        });
      },
      {
        ...options,
      }
    );
  },

  setAccept: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, {id_idea: string}>(
      ({id_idea}) => {
        dataUserRefetch && dataUserRefetch();
        return putData({
          url: `/api/ideas/accept`,
          body: {
            id_idea
          },
          token,
        });
      },
      {
        ...options,
      }
    );
  },
};
