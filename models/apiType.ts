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
