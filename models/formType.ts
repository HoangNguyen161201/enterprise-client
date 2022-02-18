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

export interface IDepartmentForm {
    id?: string
    name: string
    description: string
}


export interface ISubmissionForm {
    id?: string
    name: string
    description: string,
    closure_date: string, 
    final_closure_date: string
}

export interface IResetPass {
    password: string
    passwordConfirm: string
}

export interface IAssignUsers {
    userId?: string | string[] | undefined,
    users?: string | string[] | undefined,
    departmentId: string,
}