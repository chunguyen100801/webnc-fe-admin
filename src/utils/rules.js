import * as zod from 'zod';

const authValidation = {
  email: zod
    .string()
    .min(1, { message: 'Email is required' })
    .email('Email is invalid')
    .max(160, 'Length from 5 to 160 characters')
    .trim(),
  password: zod
    .string()
    .min(1, 'Password is required')
    .min(5, 'Length from 5 to 160 characters')
    .max(160, 'Length from 5 to 160 characters'),
  confirmPassword: zod
    .string()
    .min(1, 'Confirm password is required')
    .min(5, 'Length from 5 to 160 characters')
    .max(160, 'Length from 5 to 160 characters'),
  firstName: zod
    .string()
    .min(1, 'First name is required')
    .max(160, 'Maximum length is 160 characters')
    .trim(),
  lastName: zod
    .string()
    .min(1, 'Last name is required')
    .max(160, 'Maximum length is 160 characters')
    .trim(),
  phoneNumber: zod
    .string()
    .min(1, 'Phone number is required')
    .max(20, 'Maximum length is 20 characters')
    .trim(),
  address: zod
    .string()
    .min(1, 'Address is required')
    .max(160, 'Maximum length is 160 characters')
    .trim(),
  role: zod.string().min(1, 'Role is required').trim(),
  sex: zod.string().min(1, 'Sex is required').trim(),
};

export const loginSchema = zod.object({
  email: authValidation.email,
  password: authValidation.password,
});

export const registerSchema = zod
  .object({
    email: authValidation.email,
    password: authValidation.password,
    confirmPassword: authValidation.confirmPassword,
    firstName: authValidation.firstName,
    lastName: authValidation.lastName,
    phoneNumber: authValidation.phoneNumber,
    address: authValidation.address,
    role: authValidation.role,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Confirm password does not match',
    path: ['confirmPassword'],
  });

export const updateProfileSchema = zod.object({
  firstName: authValidation.firstName,
  lastName: authValidation.lastName,
  phoneNumber: authValidation.phoneNumber,
  address: authValidation.address,
  sex: authValidation.sex,
});

export const changePasswordSchema = zod
  .object({
    oldPassword: authValidation.password,
    newPassword: authValidation.password,
    confirmPassword: authValidation.confirmPassword,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Confirm password does not match',
    path: ['confirmPassword'],
  });

export const resetPasswordSchema = zod
  .object({
    password: authValidation.password,
    confirmPassword: authValidation.confirmPassword,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Confirm password does not match',
    path: ['confirmPassword'],
  });

export const classSchema = zod.object({
  name: zod.string().min(1, 'Name is required').max(100, 'Maximum length is 100 characters'),
  description: zod.optional(zod.string().max(100, 'Maximum length is 100 characters')),
  room: zod.optional(zod.string().max(100, 'Maximum length is 100 characters')),
  topic: zod.optional(zod.string().max(100, 'Maximum length is 100 characters')),
  avatar: zod.optional(),
});

export const memberSchema = zod.object({
  studentId: zod.string().min(1, 'Student Id is required').max(20, 'Maximum length is 20 characters'),
});
