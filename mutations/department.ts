import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { IDepartmentForm, ISubmissionForm } from 'models/formType';
import { deleteData, postData, putData } from '../utils/fetchData';
import { IMutation } from 'models/apiType';

export const departmentMutation = {
  add: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, IDepartmentForm>(
      (dataForm) => {
        dataUserRefetch && dataUserRefetch();
        return postData({
          url: '/api/departments',
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
  delete: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, string>(
      (id) => {
        dataUserRefetch && dataUserRefetch();
        return deleteData({
          url: `/api/submissions/${id}`,
          token,
        });
      },
      {
        ...options,
      }
    );
  },
};
