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

interface IOptionIdea {
  _page: number;
  _limit: number;
  _sort?: number;
  _sortBy?: string;
  _reaction?: string | null;
}

export const getAllIdeas = (options: IOptionIdea, accessToken: string | undefined) => {
  return useQuery<IAllIdeas, AxiosError>(
    ['ideas', options._page, options._limit, options._reaction],
    async () => {
      return await getData({ url: `/api/ideas`, token: accessToken, params: options});
    },
    {
      enabled: !!accessToken,
      select: (data)=> {
        console.log(data)
        if(data.ideas?.length == 0)
          return data
        // if(data.ideas[0]?._id.reactionType_id) {
         
        //   return {
        //     statusCode: data.statusCode,
        //     msg: data.msg,
        //     page_Index: data.page_Index,
        //     ideas: []
        //   }
        // }
        return data
      }
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
