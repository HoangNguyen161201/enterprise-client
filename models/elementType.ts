import { ILogin } from '.';

export interface ICopyAcc {
  acc: ILogin;
  handleSetAcc: (acc: ILogin) => void;
}

export interface IOptionSelect {
    label: any
    value: any
}

export interface IFieldCard {
    label: string
    content: string
    view?: boolean
    xs?: number
    xl?: number
}
  

export interface IUsersNotDepartment {
  staffs: IOptionSelect[] | undefined;
  QACoordinators: IOptionSelect[] | undefined;
  DepartmentManagers: IOptionSelect[] | undefined;
}
