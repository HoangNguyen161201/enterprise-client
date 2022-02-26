import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { ICategoryForm, ICommentForm } from 'models/formType';
import { deleteData, postData, putData } from '../utils/fetchData';
import { IMutation } from 'models/apiType';


export const commentMutation = {
  add: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, ICommentForm>(
      (dataForm) => {
        dataUserRefetch && dataUserRefetch();
        return postData({
          url: '/api/comments',
          body: dataForm,
          token,
        });
      },
      {
        ...options,
      }
    );
  },
}