import { IDetailUser } from "./apiType";
import { ILogin } from "./formType";

export interface ICopyAcc {
  acc: ILogin;
  handleSetAcc: (acc: ILogin) => void;
}

export interface IStaticUser {
  label: string
  count: number
  icon: string
}

export interface IFilterIdeas {
  page: number;
  limit: number;
  nameById: string | null;
  valueById: string | null;
  reaction: string | null;
  interactive: number | null;
  searchFirst: string;
  search: string;
  icon: string;
  detailUser: IDetailUser;
  isShowAccept?: boolean;
  isShowUpdate?: boolean;
  isFilterBySub?: boolean;
  accept?: boolean
  _getBy?: string;
  _getValue?: string;
  isRefetch?: boolean
  setIsRefetch?: any
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
