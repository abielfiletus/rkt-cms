import * as yup from 'yup'
import { ValidationMessage } from '../../../configs/validationMessage'

export const EditRencanaStrategisSchema = yup.object({
  id: yup.string().required(ValidationMessage.required('Rencana Strategis ID')),
  no: yup.string().required(ValidationMessage.required('No IKU')),
  name: yup.string().required(ValidationMessage.required('Nama IKU'))
})

export const AddRencanaStrategisSchema = yup.object({
  no: yup.string().required(ValidationMessage.required('No IKU')),
  name: yup.string().required(ValidationMessage.required('Nama IKU'))
})
