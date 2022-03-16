export interface IPropsFetchData {
  url: string;
  body?: any;
  token?: string;
  params?: any;
}

export interface ICommon {
  status?: string | number;
  msg?: string;
  statusCode?: number;
}

export interface IStatusIdea extends ICommon {
  all: number;
  accept: number;
  not_accept: number;
}

export interface IStatusIdea extends ICommon {
  data: {
    avatar: string;
    name: string;
    _id: string;
    count: number;
  }[];
}

//Interface auth
export interface ILogout extends ICommon {}

export interface IAccessToken extends ICommon {
  accessToken: {
    token: string;
  };
  [index: string]: any;
}

// Interface department
export interface IDepartments extends ICommon {
  departments: Array<{
    _id: string;
    name: string;
    description: string;
    root: boolean;
    count_users: number;
  }>;
  [index: string]: any;
}

export interface IDetailDepartment extends ICommon {
  department: {
    _id: string;
    name: string;
    description: string;
    count_users: number;
    employees: Array<IUser>;
    qa_coordinator?: IUser;
    qa_manager?: IUser;
    department_manager?: IUser;
    [index: string]: any;
  };
}

//Iterface user
export interface IAvatar {
  public_id: string;
  url: string;
  cloudinary_id?: string;
}

export interface IUser {
  id: any;
  _id: any;
  employee_id: number;
  name: string;
  role: string;
  root: boolean;
  email: string;
  avatar: IAvatar;
  deleted: boolean;
  department_id?: any;
  cloudinary_id?: string;
  phone?: string;
  city?: string;
  country?: string;
  street?: string;
  social_networks?: string[];
  [index: string]: any;
}

export interface IDetailUser extends ICommon {
  user: IUser;
  accessToken: {
    token: string;
    exp: number;
  };
  [index: string]: any;
}

export interface IResUsersNotDepartments {
  staffs?: IUser[];
  QACoordinators?: IUser[];
  departmentManagers?: IUser[];
  [index: string]: any;
}

export interface IAllUsers extends ICommon {
  users: IUser[];
  [index: string]: any;
}

//Interface submission
export interface ISubmission {
  _id: string;
  name: string;
  description: string;
  closure_date: string;
  final_closure_date: string;
  background: string;
  [index: string]: any;
}

export interface IDetailSubmission extends ICommon {
  submission: ISubmission;
}

export interface IMutation {
  options: any;
  dataUserRefetch?: any;
  token?: string;
}

export interface ISubmissions extends ICommon {
  submissions: Array<ISubmission>;
  page_Index: number;
  [index: string]: any;
}

export interface IStaticUserApi extends ICommon {
  data: {
    label: string;
    count: number;
    icon: string;
  }[];
}

export interface ISubId extends ICommon {
  submissions: {
    _id: string;
    name: string;
  }[];
}

export interface IResUsersRole {
  msg?: string;
  users?: any[];
  statusCode: number;
  [index: string]: any;
}

//Interface category
export interface IDetailCategory extends ICommon {
  _id: string;
  name: string;
  description: string;
  [index: string]: any;
}

export interface IallCategories extends ICommon {
  categories: IDetailCategory[];
}

//Interface idea
export interface IFileUpload {
  public_id: string;
  url: string;
  name: string;
  _id: string;
}

export interface IIdea {
  _id?: any;
  user_id: IUser;
  category_id: IDetailCategory;
  submission_id: ISubmission;
  cloudinary_id: string;
  title: string;
  content: string;
  description: string;
  files: IFileUpload[];
  anonymously: boolean;
  accept: boolean;
  view: number;
  createdAt: string;
  [index: string]: any;
}

export interface IReaction {
  _id: string;
  count: number;
}

export interface IDetailIdea extends ICommon {
  countReactions?: IReaction[];
  idea: IIdea;
}

export interface IAllIdeas extends ICommon {
  ideas: IIdea[];
  page_Index?: number;
}

export interface IUrlDowloadZip extends ICommon {
  url: string;
}

export interface Ireaction {
  _id: string;
  name: string;
  icon: string;
  count?: number;
}

export interface Ireactions extends ICommon {
  reactionTypes: Ireaction[];
}

export interface IcountAll extends ICommon {
  count_user: number;
  count_department: number;
  count_idea: number;
}

export interface IAcceptStatic extends ICommon {
  data: number[];
}

export interface IIdeaByDate extends ICommon {
  data: {
    _ids: string[];
    names: string[];
    descriptions: string[];
    count: number[];
  };
}

export interface IManyIdeas extends ICommon {
  data: {
    email: string;
    avatar: {
      public_id: string;
      url: string;
    };
    count: number;
  };
}

export interface IIdeaByYear extends ICommon {
  data: number[];
}

//Interface comment
export interface IComment {
  anonymously: boolean;
  _id: string;
  content: string;
  user_id: IUser;
  idea_id?: string;
  createdAt: string;
  updatedAt: string;
  [index: string]: any;
}

export interface ICommentResponse extends IComment {
  replies: IComment[];
}

export interface IallComments extends ICommon {
  comments: ICommentResponse[];
}

//Interface reaction
export interface IReaction {
  _id: string;
  user_id: string;
  idea_id: string;
  [index: string]: any;
}
export interface IReactionUserIdea extends ICommon {
  reaction: IReaction;
}

//Interface draft idea
export interface IDraft {
  _id: string;
  title: string;
  description: string;
  content: string;
  anonymously: boolean;
  user_id: string;
  submission_id: string;
  [index: string]: any;
}

export interface IDraftResponse extends ICommon {
  draft: IDraft;
}
