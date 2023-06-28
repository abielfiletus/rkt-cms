import * as yup from 'yup'
import { ValidationMessage } from '../../../configs/validationMessage'

export const EditRencanaStrategisSchema = yup.object({
  id: yup.string().required(ValidationMessage.required('Rencana Strategis ID')),
  tahun: yup.string().required(ValidationMessage.required('Tahun')),
  visi: yup.string().required(ValidationMessage.required('Visi')),
  misi: yup.string().required(ValidationMessage.required('Misi')),
  tujuan: yup.string().required(ValidationMessage.required('Tujuan Strategis')),
  sasaran: yup.string().required(ValidationMessage.required('Sasaran Strategis'))
})

export const AddRencanaStrategisSchema = yup.object({
  tahun: yup.string().required(ValidationMessage.required('Tahun')),
  visi: yup.string().required(ValidationMessage.required('Visi')),
  misi: yup.string().required(ValidationMessage.required('Misi')),
  tujuan: yup.string().required(ValidationMessage.required('Tujuan Strategis')),
  sasaran: yup.string().required(ValidationMessage.required('Sasaran Strategis'))
})
