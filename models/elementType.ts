import { ILogin } from ".";

export interface ICopyAcc {
    acc: ILogin
    handleSetAcc: (acc: ILogin) => void
}