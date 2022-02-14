import { UseFormReturn } from "react-hook-form";

export interface IInput {
    type?: string
    name: string
    formSetting: UseFormReturn<any, object>
    label: string
    placeholder?: string
    [index: string]: any
}

export interface ILogin {
    email: string
    password: string
    role: string
}

export interface IDepartment {
    name: string
    description: string
}

export interface IResetPass {
    password: string
    passwordConfirm: string
}