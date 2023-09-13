import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Dialog, DialogContent, DialogTitle, OutlinedInput, useTheme } from '@mui/material'
import { useMemo, useState } from 'react'
import { IModalProp } from '../../../configs/modalConfig'
import { apiPatch, apiPost } from '../../../util/api-fetch'
import FormControl from '@mui/material/FormControl'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { AddDocumentSchema, EditDocumentSchema } from './dokumen.schema'
import Button from '@mui/material/Button'
import ErrorMessage from '../error-message'
import FileInput from '../file-input'
import CustomInputLabel from '../../../views/form-layouts/custom-input-label'

export default function DocumentModal(props: IModalProp) {
  const { data, type, handleClose } = props
  const baseUrl = '/document'

  //State
  const [file, setFile] = useState('')

  const theme = useTheme()

  const formik = useFormik({
    initialValues: {
      id: data?.id || '',
      name: data?.name || '',
      description: data?.description || '',
      file: ''
    },
    validationSchema: type === 'tambah' ? AddDocumentSchema : EditDocumentSchema,
    enableReinitialize: true,
    onSubmit: async values => {
      let fetch

      if (type === 'ubah') {
        fetch = await apiPatch(baseUrl + '/' + data?.id, values)
      } else {
        fetch = await apiPost(baseUrl, values)
      }

      if (fetch.code === 422) {
        formik.setErrors(fetch.error)
      } else {
        toast.success(`Berhasil ${type === 'ubah' ? 'Mengubah Data' : 'Membuat Data'}`)
        handleClose(true)
      }
    }
  })

  useMemo(() => {
    if (data) {
      formik.setValues({ id: data?.id, name: data?.name, description: data?.description, file: data?.file })
      setFile(process.env.NEXT_PUBLIC_BE_URL + '/' + data?.file)
    }
  }, [data])

  const handleChangeFile = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const objectUrl = URL.createObjectURL(event.target.files[0])
      if (objectUrl) setFile(objectUrl)
      formik.setFieldValue('file', event.target.files[0])
    } else {
      setFile('')
      await formik.setFieldValue('file', '')
    }
  }

  return (
    <Dialog
      open={true}
      onClose={(event, reason) => {
        if (reason && reason == 'backdropClick') handleClose(false)
      }}
      maxWidth={'md'}
      id={type}
      fullWidth
    >
      <DialogTitle>
        <Typography fontWeight={'bold'} fontSize={15} textTransform={'capitalize'}>
          {type} Data Dokumen Peraturan
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form autoComplete='off' onSubmit={formik.handleSubmit} noValidate>
          <FormControl margin={'dense'} fullWidth>
            <CustomInputLabel id={'name'} label={'Nama Dokumen'} />
            <OutlinedInput
              label={'Nama Dokumen'}
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              id={'name'}
              name={'name'}
              sx={{ fontSize: 11.5 }}
              disabled={type === 'detail'}
              size={'small'}
              fullWidth
            />
            {formik.touched.name && formik.errors.name && <ErrorMessage message={formik.errors.name as string} />}
          </FormControl>
          <FormControl margin={'dense'} fullWidth>
            <CustomInputLabel id={'desc'} label={'Keterangan Dokumen'} />
            <OutlinedInput
              label={'Keterangan Dokumen'}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              id={'description'}
              name={'description'}
              minRows={2}
              inputProps={{ maxLength: 255 }}
              sx={{ fontSize: 11.5 }}
              disabled={type === 'detail'}
              size={'small'}
              fullWidth
              multiline
            />
            {formik.touched.name && formik.errors.name && <ErrorMessage message={formik.errors.name as string} />}
          </FormControl>
          <Box marginTop={3} width={250} textAlign={'left'}>
            <Typography fontWeight={'500'} fontSize={12}>
              Upload berkas pendukung <span style={{ color: theme.palette.error.main }}>*</span>
            </Typography>
            <Typography fontStyle={'italic'} fontSize={10.5} color={'error'}>
              {'*File dalam bentuk PDF < 1 MB'}
            </Typography>
            <FileInput
              name={'file'}
              error={formik.touched.file && formik.errors.file}
              handleChange={handleChangeFile}
              disabled={type === 'detail'}
              errorMessage={formik.errors.file as string}
              mimeAccept={'.pdf'}
              value={file}
              paddingTopError={'7px'}
              sx={{ marginLeft: '0 !important' }}
              url={process.env.NEXT_PUBLIC_BE_URL + '/' + data?.file}
              width={120}
              height={120}
            />
          </Box>
          <Box textAlign={'right'}>
            {type !== 'detail' && (
              <Button type={'submit'} color={'primary'} size={'small'} sx={{ fontSize: 12 }}>
                Simpan
              </Button>
            )}
            <Button type={'button'} onClick={() => handleClose(false)} color={'secondary'} size={'small'} sx={{ fontSize: 12 }}>
              Batal
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  )
}
