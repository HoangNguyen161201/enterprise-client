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

export const validateAssignDepartment = yup.object({
  qa_manager: yup.string().required('Please select qa manager'),
  qa_coordinator: yup.string().required('Please select qa coordinator'),
});

export const validateResetPass = yup.object({
  password: yup
    .string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
    ),
  passwordConfirm: yup
    .string()
    .label('Password Confirm')
    .required()
    .oneOf([yup.ref('password')], 'Passwords does not match'),
});
