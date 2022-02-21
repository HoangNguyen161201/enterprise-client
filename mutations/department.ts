import { AxiosError } from 'axios';
import { IMutation } from 'models/apiType';
import { IAssignUsers, IDepartmentForm } from 'models/formType';
import { useMutation } from 'react-query';
import { deleteData, postData, putData } from '../utils/fetchData';


export const departmentMutation = {
  AssignManyUser: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, IAssignUsers>(
        ({ users, departmentId }) => {
            dataUserRefetch && dataUserRefetch()
            return postData({
              url: `/api/users/assign-many`,
              body: {
                users,
                departmentId,
              },
              token,
            });
          },
      {
        ...options,
      }
    );
  },
  AssignOneUser: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, IAssignUsers>(
      ({ userId, departmentId }) => {
        dataUserRefetch && dataUserRefetch();
        return postData({
          url: `/api/users/assign`,
          body: {
            userId,
            departmentId,
          },
          token,
        });
      },
      {
        ...options,
      }
    );
  },
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
    return useMutation<any, AxiosError, IDepartmentForm>(
      (dataForm) => {
        dataUserRefetch && dataUserRefetch();
        return putData({
          url: `/api/departments/${dataForm.id}`,
          body: dataForm,
          token,
        });
      },
      {
        ...options,
      }
    );
  },
  deleteAll: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, Array<string>>(
      (Ids) => {
        dataUserRefetch && dataUserRefetch();
        return postData({
          url: `/api/departments/delete-many`,
          token,
          body: { departments: Ids },
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
        dataUserRefetch();
        return deleteData({ url: `/api/departments/${id}`, token });
      },
      {
        ...options,
      }
    );
  },
  removeAllStaffs: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, Array<string>>(
      (Ids) => {
        dataUserRefetch && dataUserRefetch();
        return postData({
          url: `/api/users/remove-assign-many`,
          token,
          body: { users: Ids },
        });
      },
      {
        ...options,
      }
    );
  },

  removeStaff: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, string>(
      (id: string) => {
        dataUserRefetch && dataUserRefetch();
        return deleteData({
          url: `/api/users/remove-assign/${id}`,
          token,
        });
      },
      {
        ...options,
      }
    );
  },
};
