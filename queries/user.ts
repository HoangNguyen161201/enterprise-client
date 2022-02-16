import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { getData } from "../utils";

export const getUsersRoleDepartment = (role: string, hasDepartment: string, accessToken: string) => {
    return useQuery<any, AxiosError>(
      ['users', role, `department-${hasDepartment}`],
      async () => {
        return await getData({ url: `/api/users/role/${role}?department=${hasDepartment}`, token: accessToken });
      },
      {
        enabled: !!accessToken,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      }
    );
  };