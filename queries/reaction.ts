import { AxiosError } from "axios";
import { Ireactions } from "models/apiType";
import { useQuery } from "react-query";
import { getData } from "utils/fetchData";

export const getReactType = () => {
    return useQuery<Ireactions, AxiosError>(
      ['reactType'],
      async () => {
        return await getData({ url: '/api/reaction-types'});
      }
    );
  };
  