import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Dialog, DialogContent, DialogTitle, OutlinedInput, useTheme } from '@mui/material'
import { useMemo, useState } from 'react'
import { IModalProp } from '../../../configs/modalConfig'
import { apiPatch, apiPost } from '../../../util/api-fetch'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { AddDocumentSchema, EditDocumentSchema } from './dokumen.schema'
import Button from '@mui/material/Button'
import ErrorMessage from '../error-message'
import FileInput from '../file-input'

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
        <Typography fontWeight={'bold'} fontSize={23} textTransform={'capitalize'}>
          {type} Data Dokumen Peraturan
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form autoComplete='off' onSubmit={formik.handleSubmit} noValidate>
          <FormControl margin={'dense'} fullWidth>
            <InputLabel id={'name'}>Nama Dokumen</InputLabel>
            <OutlinedInput
              label={'Nama Dokumen'}
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              id={'name'}
              name={'name'}
              fullWidth
            />
            {formik.touched.name && formik.errors.name && <ErrorMessage message={formik.errors.name as string} />}
          </FormControl>
          <FormControl margin={'dense'} fullWidth>
            <InputLabel id={'name'}>Keterangan Dokumen</InputLabel>
            <OutlinedInput
              label={'Keterangan Dokumen'}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              id={'description'}
              name={'description'}
              minRows={2}
              inputProps={{ maxLength: 255 }}
              fullWidth
              multiline
            />
            {formik.touched.name && formik.errors.name && <ErrorMessage message={formik.errors.name as string} />}
          </FormControl>
          <Box marginTop={3} width={250} textAlign={'left'}>
            <Typography fontWeight={'500'}>
              Upload berkas pendukung <span style={{ color: theme.palette.error.main }}>*</span>
            </Typography>
            <Typography variant={'caption'} fontStyle={'italic'}>
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
            />
          </Box>
          <Box textAlign={'right'}>
            {type !== 'detail' && (
              <Button type={'submit'} color={'primary'}>
                SIMPAN
              </Button>
            )}
            <Button type={'button'} onClick={() => handleClose(false)} color={'secondary'}>
              BATAL
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  )
}
