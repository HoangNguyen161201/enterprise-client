import * as yup from 'yup';

// validate field by yup

export const validateLogin = yup.object({
  email: yup.string().required('Please enter your email').email('Email format wrong'),
  password: yup.string().required('Please enter your password'),
  role: yup.string().required('Please enter your role'),
});

export const validateRecoverPass = yup.object({
  email: yup.string().required('Please enter your email').email('Email format wrong'),
});

export const validateAddDepartment = yup.object({
  name: yup
    .string()
    .required('Please enter department name')
    .min(6, 'Department names should be at least 6 characters'),
  description: yup
    .string()
    .required('Please enter department description')
    .min(20, 'Department names should be at least 20 characters'),
});
