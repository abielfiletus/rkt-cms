import * as yup from 'yup'
import { ValidationMessage } from '../../../configs/validationMessage'

export const EditDocumentSchema = yup.object({
  id: yup.string().required(ValidationMessage.required('Document ID')),
  name: yup.string().required(ValidationMessage.required('Nama Dokumen')),
  description: yup.string().required(ValidationMessage.required('Keterangan Dokumen')),
  file: yup.string().required(ValidationMessage.required('Perjanjian Kerja'))
})

export const AddDocumentSchema = yup.object({
  name: yup.string().required(ValidationMessage.required('Nama Dokumen')),
  description: yup.string().required(ValidationMessage.required('Keterangan Dokumen')),
  file: yup.string().required(ValidationMessage.required('Perjanjian Kerja'))
})
