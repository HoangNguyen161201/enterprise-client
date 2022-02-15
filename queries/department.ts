import { AxiosError } from 'axios';
import {useQuery} from 'react-query'
import { getData } from '../utils';

export const getDetailDepartment = (id: string) => {
    return useQuery<any, AxiosError>(
      ['department', id],
      async () => {
        return await getData({ url: `/api/departments/${id}` });
      },
      {
          retry: 1,
          refetchOnWindowFocus: false,
          refetchOnMount: false,
      }
    );
  };
  