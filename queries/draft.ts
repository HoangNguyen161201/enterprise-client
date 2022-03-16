import { AxiosError } from 'axios';
import { IDraftResponse } from 'models/apiType';
import { useQuery } from 'react-query';
import { getData } from 'utils/fetchData';

export const getDraftIdea = (
  user_id: string,
  submission_id: string,
  initialData?: IDraftResponse
) => {
  return useQuery<IDraftResponse, AxiosError>(
    ['draft', user_id, submission_id],
    async () => {
      return await getData({ url: `/api/drafts/user/${user_id}/submission/${submission_id}` });
    },
    {
      enabled: !!user_id && !!submission_id,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      initialData,
    }
  );
};
