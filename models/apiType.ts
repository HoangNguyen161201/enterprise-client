export interface IPropsFetchData {
    url: string
    body?: any
    token?: string
  }

export interface IAccessToken {
  status: string | number
  accessToken: {
    token: string
  }
  msg: string
}
  