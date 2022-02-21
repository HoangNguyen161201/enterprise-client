import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { ISubmissionForm } from 'models/formType';
import { deleteData, postData, putData } from '../utils/fetchData';

interface SubmMutation {
  options: any;
  dataUserRefetch?: any;
  token?: string;
}

export const submMutation = {
  add: ({ options, dataUserRefetch, token }: SubmMutation) => {
    return useMutation<any, AxiosError, ISubmissionForm>(
      (data) => {
        dataUserRefetch && dataUserRefetch();
        return postData({
          url: '/api/submissions',
          body: data,
          token,
        });
      },
      {
        ...options,
      }
    );
  },
  update: ({ options, dataUserRefetch, token }: SubmMutation) => {
    return useMutation<any, AxiosError, ISubmissionForm>(
      (data) => {
        dataUserRefetch && dataUserRefetch();
        return putData({
          url: `/api/submissions/${data._id}`,
          body: data,
          token,
        });
      },
      {
        ...options,
      }
    );
  },
  delete: ({ options, dataUserRefetch, token }: SubmMutation) => {
    return useMutation<any, AxiosError, string>(
      (id) => {
        dataUserRefetch && dataUserRefetch();
        return deleteData({
          url: `/api/submissions/${id}`,
          token
        });
      },
      {
        ...options,
      }
    );
  },
};
