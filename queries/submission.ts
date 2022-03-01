import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { IDetailSubmission, ISubmissions } from '../models/apiType';
import { getData } from '../utils/fetchData';

export const getallSubmissions = (accessToken?: string, initial?: ISubmissions, params?: any) => {
    return useQuery<ISubmissions, AxiosError>(
      params ? ['submissions', params._page, params._search, params._time]: 'submissions',
      async () => {
        return await getData({ url: `/api/submissions`, token: accessToken, params});
      },
      {
        enabled: !!accessToken,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        initialData: initial,
        keepPreviousData: true
      }
    );
};

export const getDetailSubmission = (
  id: string,
  accessToken?: string,
  initial?: IDetailSubmission
) => {
  return useQuery<IDetailSubmission, AxiosError>(
    ['submission', id],
    async () => {
      return await getData({ url: `/api/submissions/${id}`, token: accessToken });
    },
    {
      enabled: !!accessToken && !!id,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      initialData: initial,
    }
  );
};
