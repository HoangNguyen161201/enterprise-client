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
  _sort: number;
  _sortBy: string;
  _nameById: string | null;
  _valueById: string | null;
  _interactive: number | null
  _reaction: string | null,
  _search: string
  _accept: number
}

export const getAllIdeas = (options: Partial<IOptionIdea>, accessToken: string | undefined,  initial?: IAllIdeas) => {
  return useQuery<IAllIdeas, AxiosError>(
    ['ideas',  options._search, options._page, options._limit,  options._valueById, options._interactive, options._reaction],
    async () => {
      return await getData({ url: `/api/ideas`, token: accessToken, params: options});
    },
    {
      initialData: initial,
      enabled: !!accessToken,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      select: (data)=> {
        if(data.ideas.length === 0) return data
        const ideas = data.ideas.map(idea=> {
          console.log(idea)
          return {
            ...idea,
            count: idea.totalReaction ? idea.totalReaction : idea.view  | 0
          }
        })
        return {
          statusCode: data.statusCode,
          msg: data.msg,
          ideas,
          page_Index: data.page_Index
        }
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
