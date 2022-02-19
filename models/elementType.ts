import { ILogin } from '.';

export interface ICopyAcc {
  acc: ILogin;
  handleSetAcc: (acc: ILogin) => void;
}

export interface IOptionSelect {
    label: any
    value: any
}

export interface ICol {
  xs?: number
  sm?: number
  lg?: number
  xl?: number
}

export interface IFieldCard extends ICol {
    label: string
    content: string
    view?: boolean
}

export interface IColumn {
  title: string
  dataIndex?: string
  key?: string
}
  
export interface IUsersNotDepartment {
  staffs: IOptionSelect[] | undefined
  QACoordinators: IOptionSelect[] | undefined
  DepartmentManagers: IOptionSelect[] | undefined
}

export interface IStaff extends ICol{
  employee_id?: number
  name: string
  role: string
  image: string
}
