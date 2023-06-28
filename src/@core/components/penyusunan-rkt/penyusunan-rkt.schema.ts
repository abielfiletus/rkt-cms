import * as yup from 'yup'
import { ValidationMessage } from '../../../configs/validationMessage'

export const EditPenyusunanRKTSchema = yup.object({
  id: yup.string().required(ValidationMessage.required('id')),
  tahun: yup.string().required(ValidationMessage.required('Tahun')),
  name: yup.string().required(ValidationMessage.required('Nama Usulan Kegiatan')),
  target_perjanjian_kerja: yup.string().required(ValidationMessage.required('Target Perjanjian')),
  usulan_anggaran: yup.string().required(ValidationMessage.required('Usulan Anggaran')),
  iku_data: yup
    .array()
    .of(
      yup.object({
        iku_id: yup.string().required(ValidationMessage.required('IKU')),
        aksi_data: yup
          .array()
          .of(
            yup.object({
              rencana_aksi: yup.string().required(ValidationMessage.required('Rencana Aksi')),
              tw_1: yup.string().required(ValidationMessage.required('TW 1')),
              tw_2: yup.string().required(ValidationMessage.required('TW 2')),
              tw_3: yup.string().required(ValidationMessage.required('TW 3')),
              tw_4: yup.string().required(ValidationMessage.required('TW 4')),
              total: yup.string().required(ValidationMessage.required('Total'))
            })
          )
          .required('Rencana Aksi')
      })
    )
    .required(ValidationMessage.required('iku_data')),
  rab_data: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required(ValidationMessage.required('Nama Rincian')),
        unit: yup.string().required(ValidationMessage.required('Unit')),
        price: yup.string().required(ValidationMessage.required('Harga'))
      })
    )
    .required(ValidationMessage.required('rab_data')),
  surat_usulan: yup.string().required(ValidationMessage.required('Surat Usulan')),
  kak: yup.string().required(ValidationMessage.required('kak')),
  referensi_harga: yup.string().required(ValidationMessage.required('referensi_harga')),
  pendukung: yup.string().required(ValidationMessage.required('pendukung')),
  submit_by: yup.string().required(ValidationMessage.required('submit_by'))
})

export const AddPenyusunanRKTSchema = yup.object({
  tahun: yup.string().required(ValidationMessage.required('Tahun')),
  name: yup.string().required(ValidationMessage.required('Nama Usulan Kegiatan')),
  target_perjanjian_kerja: yup.string().required(ValidationMessage.required('Target Perjanjian')),
  usulan_anggaran: yup.string().required(ValidationMessage.required('Usulan Anggaran')),
  iku_data: yup
    .array()
    .of(
      yup.object({
        iku_id: yup.string().required(ValidationMessage.required('IKU')),
        tw_1: yup.string().required(ValidationMessage.required('TW 1')),
        tw_2: yup.string().required(ValidationMessage.required('TW 2')),
        tw_3: yup.string().required(ValidationMessage.required('TW 3')),
        tw_4: yup.string().required(ValidationMessage.required('TW 4')),
        total: yup.string().required(ValidationMessage.required('Total')),
        aksi_data: yup
          .array()
          .of(
            yup.object({
              rencana_aksi: yup.string().required(ValidationMessage.required('Rencana Aksi'))
            })
          )
          .required('Rencana Aksi')
      })
    )
    .required(ValidationMessage.required('iku_data')),
  rab_data: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required(ValidationMessage.required('Nama Rincian')),
        unit: yup.string().required(ValidationMessage.required('Unit')),
        price: yup.string().required(ValidationMessage.required('Harga'))
      })
    )
    .required(ValidationMessage.required('rab_data')),
  surat_usulan: yup.string().required(ValidationMessage.required('Surat Usulan')),
  kak: yup.string().required(ValidationMessage.required('KAK')),
  referensi_harga: yup.string().required(ValidationMessage.required('Referensi Harga')),
  pendukung: yup.string().required(ValidationMessage.required('Pendukung Lainnya')),
  submit_by: yup.string().required(ValidationMessage.required('submit_by'))
})

export const verificationPenyusunanRKTSchema = yup.object({
  notes: yup.string().required(ValidationMessage.required('Note'))
})
