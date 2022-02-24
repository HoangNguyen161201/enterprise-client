import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { IAllIdeas } from '../models/apiType';
import { getData } from '../utils/fetchData';

export interface IQueryGetIdeasCurrentUser {
    user_id: string 
    submission_id: string
    accessToken?: string
    initial?: IAllIdeas
}

export const getIdeasCurrentUser = ({user_id, submission_id, accessToken, initial}:IQueryGetIdeasCurrentUser) => {
  return useQuery<IAllIdeas, AxiosError>(
    ['ideas', 'current-user'],
    async () => {
      return await getData({ url: `/api/ideas/user/${user_id}?submission_id=${submission_id}`, token: accessToken });
    },
    {
      enabled: !!accessToken && !!submission_id && !!user_id,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      initialData: initial,
    }
  );
};