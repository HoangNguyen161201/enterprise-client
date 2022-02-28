import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { IallComments } from '../models/apiType';
import { getData } from '../utils/fetchData';

export const getallComments = (idea_id: string, accessToken?: string, initial?: IallComments) => {
  return useQuery<IallComments, AxiosError>(
    ['comments'],
    async () => {
      return await getData({ url: `/api/comments/idea/${idea_id}`, token: accessToken });
    },
    {
      enabled: !!accessToken && !!idea_id,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      initialData: initial,
    }
  );
};
