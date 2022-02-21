import * as yup from 'yup';

// validate field by yup

//Auth valid
export const validateLogin = yup.object({
  email: yup.string().required('Please enter your email').email('Email format wrong'),
  password: yup.string().required('Please enter your password'),
  role: yup.string().required('Please enter your role'),
});

export const validateRecoverPass = yup.object({
  email: yup.string().required('Please enter your email').email('Email format wrong'),
});

export const validateResetPass = yup.object({
  password: yup
    .string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
      'Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
    ),
  passwordConfirm: yup
    .string()
    .label('Password Confirm')
    .required()
    .oneOf([yup.ref('password')], 'Passwords does not match'),
});

//Department valid
export const validateAddDepartment = yup.object({
  name: yup
    .string()
    .required('Please enter department name')
    .min(6, 'Department names should be at least 6 characters'),
  description: yup
    .string()
    .required('Please enter department description')
    .min(20, 'Department description should be at least 20 characters'),
});

export const validateAssignDepartment = yup.object({
  qa_manager: yup.string().required('Please select qa manager'),
  qa_coordinator: yup.string().required('Please select qa coordinator'),
});


//validate form for update or create category
export const validCategory = yup.object({
  _id: yup.string(),
  name: yup
    .string()
    .required('Please enter submission name')
    .min(6, 'Submission name should be at least 6 characters'),
  description: yup
    .string()
    .required('Please enter department description')
    .min(20, 'Submission description should be at least 20 characters'),
});

//User valid
export const validateAddUser = yup.object({
  name: yup
    .string()
    .required('Please enter user employee')
    .min(6, 'Employee names should be at least 3 characters'),
  email: yup.string().required('Please enter email employee'),
  password: yup
    .string()
    .required('Please Enter password')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
      'Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
    ),
  cf_password: yup
    .string()
    .label('Password Confirm')
    .required()
    .oneOf([yup.ref('password')], 'Passwords does not match'),
  role: yup.string().required('Please select role'),
});

export const validateUpdateUser = yup.object({
  name: yup
    .string()
    .required('Please enter user employee')
    .min(6, 'Employee names should be at least 3 characters'),
  email: yup.string().required('Please enter email employee'),
  role: yup.string().required('Please select role'),
});


//validate form submission
export const validateSubmission = yup.object({
  _id: yup.string(),
  name: yup
    .string()
    .required('Please enter submission name')
    .min(6, 'Submission name should be at least 6 characters'),
  description: yup
    .string()
    .required('Please enter department description')
    .min(20, 'Submission description should be at least 20 characters'),
  closure_date: yup.date().required('khong duoc de trong'),
  final_closure_date:  yup.date().required('khong duoc de trong'),
});