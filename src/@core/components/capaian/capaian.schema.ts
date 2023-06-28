import * as yup from 'yup'
import { ValidationMessage } from '../../../configs/validationMessage'

export const EditCapaianSchema = yup.object({
  data: yup
    .array()
    .of(
      yup.object({
        capaian: yup.number().required(ValidationMessage.required('capaian')),
        masalah: yup.string().required(ValidationMessage.required('masalah')),
        progress: yup.string().required(ValidationMessage.required('progress')),
        strategi: yup.string().required(ValidationMessage.required('strategi')),
        id_capaian_iku: yup.string().required(ValidationMessage.required('id_capaian_iku'))
      })
    )
    .required(ValidationMessage.required('id')),
  tw_index: yup.number().required(ValidationMessage.required('TW Index'))
})
