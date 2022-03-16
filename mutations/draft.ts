import { AxiosError } from 'axios';
import { IMutation } from 'models/apiType';
import { IdraftForm } from 'models/formType';
import { useMutation } from 'react-query';
import { postData } from '../utils/fetchData';

export const DraftMutation = {
  add: ({ options, dataUserRefetch, token }: IMutation) => {
    return useMutation<any, AxiosError, IdraftForm>(
      (dataForm) => {
        dataUserRefetch && dataUserRefetch();
        return postData({
          url: '/api/drafts',
          body: dataForm,
          token,
        });
      },
      {
        ...options,
      }
    );
  },
};
