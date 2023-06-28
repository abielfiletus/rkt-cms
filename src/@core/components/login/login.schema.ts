import * as yup from 'yup'
import { ValidationMessage } from '../../../configs/validationMessage'

export const LoginSchema = yup.object({
  nip: yup.string().required(ValidationMessage.required('nip')),
  password: yup.string().required(ValidationMessage.required('password'))
})
