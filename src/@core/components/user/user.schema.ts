import * as yup from 'yup'
import { ValidationMessage } from '../../../configs/validationMessage'

export const EditUserSchema = yup.object({
  id: yup.string().required(ValidationMessage.required('User ID')),
  name: yup.string().required(ValidationMessage.required('Nama Lengkap')),
  role_id: yup.string().required(ValidationMessage.required('Akses')),
  department_id: yup.string().required(ValidationMessage.required('Bagian')),
  kode_prodi: yup.string(),
  nip: yup.string().required(ValidationMessage.required('Nomer Induk Pegawai (NIP)')),
  email: yup.string().email(ValidationMessage.validEmail('email')).required(ValidationMessage.required('Email'))
})

export const AddUserSchema = yup.object({
  name: yup.string().required(ValidationMessage.required('Nama Lengkap')),
  role_id: yup.string().required(ValidationMessage.required('Akses')),
  department_id: yup.string().required(ValidationMessage.required('Bagian')),
  nip: yup.string().required(ValidationMessage.required('Nomer Induk Pegawai (NIP)')),
  email: yup.string().email(ValidationMessage.validEmail('email')).required(ValidationMessage.required('Email')),
  password: yup.string().required(ValidationMessage.required('Password')),
  confirmation_password: yup
    .string()
    .required(ValidationMessage.required('Konfirmasi Password'))
    .oneOf([yup.ref('password')], ValidationMessage.match('Konfirmasi Password', 'Password')),
  kode_prodi: yup.string()
})
