import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { ISubmissions } from '../models/apiType';
import { getData } from '../utils';

export const getallSubmissions = (accessToken: string, initial?: ISubmissions, params?: any) => {
    return useQuery<any, AxiosError>(
      ['submissions', params._page, params._search],
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
