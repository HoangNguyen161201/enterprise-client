import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { IallCategories } from 'models/apiType';
import { getData } from 'utils/fetchData';

export const getallCategories = (accessToken?: string, initial?: IallCategories) => {
  return useQuery<IallCategories, AxiosError>(
    ['categories'],
    async () => {
      return await getData({ url: `/api/categories`, token: accessToken });
    },
    {
      enabled: !!accessToken,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      initialData: initial,
    }
  );
};
