import { UseFormReturn } from 'react-hook-form';

export interface IInput {
  type?: string;
  name: string;
  formSetting: UseFormReturn<any, object>;
  label: string;
  placeholder?: string;
  [index: string]: any;
}

export interface ILogin {
  email: string;
  password: string;
  role: string;
}

export interface IDepartmentForm {
  id?: string;
  name: string;
  description: string;
}

export interface ICategoryForm {
  id?: string;
  name?: string;
  description?: string;
}

export interface ISubmissionForm {
  _id?: string;
  name: string;
  description: string;
  closure_date: any;
  final_closure_date: any;
  [index: string]: any;
}

export interface IUserForm {
  id?: string;
  name: string;
  email: string;
  role: string;
  department_id?: string;
  password?: string;
  cf_password?: string;
}

export interface IIdeaForm {
  id?: string;
  title: string;
  description: string;
  content: string;
  category_id: string;
  anonymously: boolean;
}

export interface IResetPass {
  password: string;
  passwordConfirm: string;
}

export interface IAssignUsers {
  userId?: string | string[] | undefined;
  users?: string | string[] | undefined;
  departmentId: string;
}

export interface IIdeaForm {
  _id: string;
  user_id: string;
  category_id: string;
  submission_id: string;
  cloudinary_id: string;
  title: string;
  content: string;
  description: string;
  files: any[];
  anonymously: boolean;
}

export interface ICommentForm {
  content: string;
  user_id: string;
  idea_id: string;
  comment_id?: string;
  anonymously: boolean;
}

export interface IViewForm {
  user_id: string;
  idea_id: string;
}
