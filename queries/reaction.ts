import { AxiosError } from 'axios';
import { Ireactions, IReactionUserIdea } from 'models/apiType';
import { useQuery } from 'react-query';
import { getData } from 'utils/fetchData';

export const getReactType = () => {
  return useQuery<Ireactions, AxiosError>(['reactType'], async () => {
    return await getData({ url: '/api/reaction-types' });
  });
};

export const getReactionUserIdea = (user_id: string, idea_id: string) => {
  return useQuery<IReactionUserIdea, AxiosError>(
    ['reaction', user_id, idea_id],
    async () => {
      return await getData({ url: `/api/reactions/user/${user_id}?idea_id=${idea_id}` });
    },
    {
      enabled: !!user_id && !!idea_id,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
};
