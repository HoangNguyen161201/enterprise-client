import {useQuery} from 'react-query'
import { getData } from '../utils';

export const getDetailDepartment = (id: string) => {
    return useQuery(
      ['department', id],
      () => {
        return getData({ url: `/api/departments//${id}` });
      },
      {
        enabled: false
      }
    );
  };
  