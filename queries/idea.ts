import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { IAllIdeas, IDetailIdea, IUrlDowloadZip } from '../models/apiType';
import { getData, postData } from '../utils/fetchData';

export interface IQueryGetIdeasCurrentUser {
  user_id: string;
  submission_id: string;
  accessToken?: string;
  initial?: IAllIdeas;
}

export const getIdeasCurrentUser = ({
  user_id,
  submission_id,
  accessToken,
  initial,
}: IQueryGetIdeasCurrentUser) => {
  return useQuery<IAllIdeas, AxiosError>(
    ['ideas', 'current-user'],
    async () => {
      return await getData({
        url: `/api/ideas/user/${user_id}?submission_id=${submission_id}`,
        token: accessToken,
      });
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

export const getDetailIdea = (id: string, accessToken?: string, initial?: IDetailIdea) => {
  return useQuery<IDetailIdea, AxiosError>(
    ['idea', id],
    async () => {
      return await getData({ url: `/api/ideas/${id}`, token: accessToken });
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

export const getUrlDownloadZip = (tag: string) => {
  return useQuery<IUrlDowloadZip, AxiosError>(
    ['url-zip', tag],
    async () => {
      return await postData({
        url: `/api/image/download`,
        body: {
          tag,
        },
      });
    },
    {
      enabled: !!tag,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
};
