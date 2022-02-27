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

  delete: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, { comment_id: string; reply_id?: string }>(
      ({ comment_id, reply_id }) => {
        dataUserRefetch && dataUserRefetch();
        return deleteData({
          url: reply_id
            ? `/api/comments/${comment_id}?reply_id=${reply_id}`
            : `/api/comments/${comment_id}`,
          token,
        });
      },
      {
        ...options,
      }
    );
  },

  update: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, { comment_id: string; reply_id?: string; content: string }>(
      ({ comment_id, reply_id, content }) => {
        dataUserRefetch && dataUserRefetch();
        return putData({
          url: `/api/comments/${comment_id}`,
          body: {
            content,
            reply_id,
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
