export interface IPropsFetchData {
  url: string
  body?: any
  token?: string
}

export interface ICommon {
  status: string | number
  msg: string
  statusCode?: number
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
  _id: any
  name: string
  role: string
  root: boolean
  email: string
  avatar: {
    public_id: string
    url: string
  }
  [index: string]: any
}

export interface IDetailDepartment extends ICommon {
  department: {
    _id: string
    name: string
    description: string
    count_users: number
    staffs: Array<IUser>
    [index: string]: any
  }
}

export interface IResUsersNotDepartments {
  staffs?: IUser[];
  QACoordinators?: IUser[];
  departmentManagers?: IUser[];
  [index: string]: any;
}