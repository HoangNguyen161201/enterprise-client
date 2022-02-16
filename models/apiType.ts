export interface IPropsFetchData {
  url: string
  body?: any
  token?: string
}

export interface ICommon {
  status: string | number
  msg: string
}

export interface ILogout extends ICommon {}

export interface IAccessToken extends ICommon {
  accessToken: {
    token: string
  }
  [index: string]: any
}

export interface IDepartment extends ICommon {
  departments: Array<{
    _id: string
    name: string
    description: string
    root: boolean
    count_users: number
  }>
  [index: string]: any
}

export interface IUser {
  _id: any;
  name: string,
  role: string,
  root: boolean,
  email: string,
  [index: string]: any
}