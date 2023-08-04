import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Dialog, DialogContent, DialogTitle, OutlinedInput, Switch, useTheme } from '@mui/material'
import { IModalProp } from '../../../configs/modalConfig'
import { apiPatch, apiPost } from '../../../util/api-fetch'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import Button from '@mui/material/Button'
import ErrorMessage from '../error-message'
import { AddRencanaStrategisSchema, EditRencanaStrategisSchema } from './indikator-kinerja-utama.schema'
import FormControlLabel from '@mui/material/FormControlLabel'

export default function IKUModal(props: IModalProp) {
  const { data, type, handleClose } = props

  const theme = useTheme()

  const formik = useFormik({
    initialValues: {
      id: data?.id || '',
      no: data?.no || '',
      name: data?.name || '',
      is_active: data?.is_active ?? true
    },
    validationSchema: type === 'tambah' ? AddRencanaStrategisSchema : EditRencanaStrategisSchema,
    onSubmit: async values => {
      let fetch

      if (type === 'ubah') {
        fetch = await apiPatch('/indikator-kinerja-utama/' + data?.id, values)
      } else {
        fetch = await apiPost('/indikator-kinerja-utama', values)
      }

      if (fetch.code === 422) {
        formik.setErrors(fetch.error)
      } else {
        toast.success(`Berhasil ${type === 'ubah' ? 'Mengubah Data' : 'Membuat Data'}`)
        handleClose(true)
      }
    }
  })

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
        <Typography
          fontWeight={'bold'}
          textTransform={'capitalize'}
          fontSize={23}
          sx={{ [theme.breakpoints.only('xs')]: { fontSize: 18 } }}
        >
          {type} Indikator Kinerja Utama (IKU)
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form autoComplete='off' onSubmit={formik.handleSubmit} noValidate>
          <Grid spacing={5} sx={{ [theme.breakpoints.only('xs')]: { padding: 5 } }} padding={10} container>
            <FormControl margin={'dense'} fullWidth>
              <InputLabel id={'visi'}>Nomor IKU*</InputLabel>
              <OutlinedInput
                label={'Nomor IKU*'}
                value={formik.values.no}
                onChange={formik.handleChange}
                error={formik.touched.no && Boolean(formik.errors.no)}
                id={'no'}
                name={'no'}
                readOnly={type === 'detail'}
                multiline
                fullWidth
              />
              {formik.touched.no && formik.errors.no && <ErrorMessage message={formik.errors.no as string} />}
            </FormControl>
            <FormControl margin={'dense'} fullWidth>
              <InputLabel id={'misi'}>Nama IKU*</InputLabel>
              <OutlinedInput
                label={'Nama IKU*'}
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                id={'name'}
                name={'name'}
                readOnly={type === 'detail'}
                rows={5}
                multiline
                fullWidth
              />
              {formik.touched.name && formik.errors.name && <ErrorMessage message={formik.errors.name as string} />}
            </FormControl>
            {(type === 'ubah' || type === 'detail') && (
              <Grid spacing={10} alignItems={'center'} container>
                <Grid item>
                  <Typography fontWeight={'bold'}>Status</Typography>
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.is_active || false}
                        inputProps={{ 'aria-label': 'controlled' }}
                        onChange={() => formik.setFieldValue('is_active', !formik.values.is_active)}
                      />
                    }
                    label='Aktif'
                    disabled={type === 'detail'}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
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
