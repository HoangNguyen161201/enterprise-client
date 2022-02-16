import { ILogin } from ".";

export interface ICopyAcc {
    acc: ILogin
    handleSetAcc: (acc: ILogin) => void
}

export interface IOptionSelect {
    label: string
    value: string
}