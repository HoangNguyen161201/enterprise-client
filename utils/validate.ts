import * as yup from 'yup'

// validate field by yup

export const validateLogin = yup.object({
    email: yup.string().required('Please enter your email').email('Email format wrong'),
    password: yup.string().required('Please enter your password'),
    role: yup.string().required('Please enter your role')
})

export const validateRecoverPass = yup.object({
    email: yup.string().required('Please enter your email').email('Email format wrong'),
})