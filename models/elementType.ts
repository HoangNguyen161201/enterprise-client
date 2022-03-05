import { ILogin } from "./formType";

export interface ICopyAcc {
  acc: ILogin;
  handleSetAcc: (acc: ILogin) => void;
}

export interface IFilter {
  id: string | null
  icon: string
  isView: boolean
  _nameById: string
  _valueById: string
  _reaction: string
  _interactive: number
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
    user_id?: string
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
  id: string
  employee_id?: number
  name: string
  role: string
  image: string
}

export interface IMainBreadc {
  url: string
  label: string
}

export interface IBreadCrumb {
  data: IMainBreadc[]
  main: IMainBreadc
}
