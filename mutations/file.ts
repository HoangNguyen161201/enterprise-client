import { AxiosError } from 'axios';
import { IMutation } from 'models/apiType';
import { useMutation } from 'react-query';
import { postData } from '../utils/fetchData';

export const fileMutation = {
  delete: ({ options }: IMutation) => {
    return useMutation<any, AxiosError, { public_id?: string; tag?: string }>(
      (data) => {
        return postData({
          url: `/api/image/delete`,
          body: data,
        });
      },
      {
        ...options,
      }
    );
  },
};
