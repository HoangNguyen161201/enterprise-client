import { AxiosError } from 'axios';
import { IAcceptStatic, ICommon, IcountAll, IIdeaByDate, IIdeaByYear, IManyIdeas, IReactionUserIdea, IStatusIdea } from 'models/apiType';
import { useQuery } from 'react-query';
import { getData } from 'utils/fetchData';

export const getAllCount = (accessToken?: string) => {
  return useQuery<IcountAll, AxiosError>(['all count'], async () => {
    return await getData({ url: '/api/statics/count' });
  }, {
    enabled: !!accessToken,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const accept = (accessToken?: string) => {
    return useQuery<IAcceptStatic, AxiosError>(['accept'], async () => {
        return await getData({ url: '/api/statics/accept' });
      }, {
        enabled: !!accessToken,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      });
  };

interface Ioptions {
    accessToken?: string
    option: {
        _limit: number | null
        _date: string | null
    }
}

  export const ideaByDate = ({accessToken, option}: Ioptions) => {
    return useQuery<IIdeaByDate, AxiosError>(['ideaByDate', option._date, option._limit], async () => {
        return await getData({ url: '/api/statics/idea-By-Date', params: option });
      }, {
        enabled: !!accessToken,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      });
  };

  export const manyIdeas = ({accessToken, options}: {accessToken?: string, options: {department_id: string | null, _limit: number}}) => {
    return useQuery<IManyIdeas, AxiosError>(['many-idea', options.department_id, options._limit], async () => {
        return await getData({ url: '/api/statics/many-idea', params: options});
      }, {
        enabled: !!accessToken && !!options.department_id,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      });
  };

  export const topView = ({accessToken, options}: {accessToken?: string, options: {department_id: string | null, _limit: number}}) => {
    return useQuery<IManyIdeas, AxiosError>(['top-view', options.department_id, options._limit], async () => {
        return await getData({ url: '/api/statics/top-view', params: options});
      }, {
        enabled: !!accessToken && !!options.department_id,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      });
  };

  export const numberOPC = ({accessToken, department_id}: {accessToken?: string, department_id: string| null}) => {
    return useQuery<ICommon, AxiosError>(['numberOPC', department_id, ], async () => {
        return await getData({ url: '/api/statics/numberOPC', params: {
          department_id
        }});
      }, {
        enabled: !!accessToken && !!department_id,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      });
  };

  export const statusIdeas = ({accessToken, department_id}: {accessToken?: string, department_id: string| null}) => {
    return useQuery<IStatusIdea, AxiosError>(['status-ideas', department_id, ], async () => {
        return await getData({ url: '/api/statics/status-ideas', params: {
          department_id
        }});
      }, {
        enabled: !!accessToken && !!department_id,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      });
  };

  export const submissions = ({accessToken}: {accessToken?: string}) => {
    return useQuery<IStatusIdea, AxiosError>(['submission'], async () => {
        return await getData({ url: '/api/statics/submission'});
      }, {
        enabled: !!accessToken,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      });
  };

  export const ideaByYear = ({accessToken, options}: {accessToken?: string, options: {department_id: string | null, _year: number}}) => {
    return useQuery<IIdeaByYear, AxiosError>(['idea-By-Year', options.department_id, options._year], async () => {
        return await getData({ url: '/api/statics/idea-By-Year', params: options});
      }, {
        enabled: !!accessToken && !!options.department_id,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      });
  };




  
  
export const anonymously = (accessToken?: string) => {
    return useQuery<IAcceptStatic, AxiosError>(['anonymously'], async () => {
        return await getData({ url: '/api/statics/anonymously' });
      }, {
        enabled: !!accessToken,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      });
  };
