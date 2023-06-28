import * as yup from 'yup'
import { ValidationMessage } from '../../../configs/validationMessage'

export const EditPerjanjianKerjaSchema = yup.object({
  id: yup.string().required(ValidationMessage.required('id')),
  perjanjian_kerja: yup.string().required(ValidationMessage.required('Perjanjian Kerja'))
})
