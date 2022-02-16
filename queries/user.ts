import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { getData } from "../utils";

// msg: "Get user success"
// statusCode: 200
// users: []

interface IResUsersRole {
    msg?: string,
    users?: any[],
    statusCode: number,
    [index: string]: any
}

export const getUsersRoleDepartment = (role: string, hasDepartment: string, accessToken: string) => {
    return useQuery<IResUsersRole, AxiosError>(
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