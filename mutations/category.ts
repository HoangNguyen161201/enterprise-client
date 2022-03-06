import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { ICategoryForm } from 'models/formType';
import { deleteData, postData, putData } from '../utils/fetchData';
import { IDetailCategory, IMutation } from 'models/apiType';


export const CtMutation = {
  add: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, ICategoryForm>(
      (dataForm) => {
        dataUserRefetch && dataUserRefetch();
        return postData({
          url: '/api/categories',
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
    return useMutation<any, AxiosError, {categories: Partial<IDetailCategory>}>(
      (dataForm) => {
        dataUserRefetch && dataUserRefetch();
        return postData({
          url: '/api/categories/add-many',
          body: dataForm,
          token,
        });
      },
      {
        ...options,
      }
    );
  },

  update: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, ICategoryForm>(
      ({ id, name, description }) => {
        dataUserRefetch && dataUserRefetch();
        return putData({
          url: `/api/categories/${id}`,
          body: {
            name,
            description,
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
    return useMutation<any, AxiosError, ICategoryForm>(
      ({ id }) => {
        dataUserRefetch && dataUserRefetch();
        return deleteData({
          url: `/api/categories/${id}`,
          token,
        });
      },
      {
        ...options,
      }
    );
  },
};
