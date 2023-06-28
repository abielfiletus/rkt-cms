import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Dialog, DialogContent, DialogTitle, OutlinedInput, Select, Switch, useTheme } from '@mui/material'
import { IModalProp } from '../../../configs/modalConfig'
import { apiPatch, apiPost } from '../../../util/api-fetch'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import Button from '@mui/material/Button'
import ErrorMessage from '../error-message'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import MenuItem from '@mui/material/MenuItem'
import { AddRencanaStrategisSchema, EditRencanaStrategisSchema } from './rencana-strategis.schema'
import dayjs, { Dayjs } from 'dayjs'
import FormControlLabel from '@mui/material/FormControlLabel'

export default function RencanaStrategisModal(props: IModalProp) {
  const { data, type, handleClose } = props

  const theme = useTheme()

  const formik = useFormik({
    initialValues: {
      id: data?.id || '',
      tahun: data?.tahun || '',
      visi: data?.visi || '',
      misi: data?.misi || '',
      tujuan: data?.tujuan || '',
      sasaran: data?.sasaran || '',
      is_active: data?.is_active || ''
    },
    validationSchema: type === 'tambah' ? AddRencanaStrategisSchema : EditRencanaStrategisSchema,
    onSubmit: async values => {
      const baseUrl = process.env.NEXT_PUBLIC_BE_URL + '/rencana-strategis'
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
          {type} Rancangan Strategis
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form autoComplete='off' onSubmit={formik.handleSubmit} noValidate>
          <Grid padding={10} spacing={5} container>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dayjs(formik.values.tahun)}
                  label={'Tahun Renstra*'}
                  openTo='year'
                  views={['year']}
                  sx={
                    formik.touched.tahun && formik.errors.tahun
                      ? { '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.error.main } }
                      : null
                  }
                  onChange={(value: Dayjs | null) => {
                    if (value) formik.setFieldValue('tahun', dayjs(value).format('YYYY'))
                  }}
                  readOnly={type === 'detail'}
                />
              </LocalizationProvider>
              {formik.touched.tahun && formik.errors.tahun && <ErrorMessage message={formik.errors.tahun as string} />}
            </Box>
            <FormControl margin={'dense'} fullWidth>
              <InputLabel id={'visi'}>Visi*</InputLabel>
              <OutlinedInput
                label={'Visi*'}
                value={formik.values.visi}
                onChange={formik.handleChange}
                error={formik.touched.visi && Boolean(formik.errors.visi)}
                id={'visi'}
                name={'visi'}
                rows={4}
                readOnly={type === 'detail'}
                multiline
                fullWidth
              />
              {formik.touched.visi && formik.errors.visi && <ErrorMessage message={formik.errors.visi as string} />}
            </FormControl>
            <FormControl margin={'dense'} fullWidth>
              <InputLabel id={'misi'}>Misi*</InputLabel>
              <OutlinedInput
                label={'Misi*'}
                value={formik.values.misi}
                onChange={formik.handleChange}
                error={formik.touched.misi && Boolean(formik.errors.misi)}
                id={'misi'}
                name={'misi'}
                rows={4}
                readOnly={type === 'detail'}
                multiline
                fullWidth
              />
              {formik.touched.misi && formik.errors.misi && <ErrorMessage message={formik.errors.misi as string} />}
            </FormControl>
            <FormControl margin={'dense'} fullWidth>
              <InputLabel id={'tujuan_strategis'}>Tujuan Strategis*</InputLabel>
              <OutlinedInput
                label={'Tujuan Strategis*'}
                value={formik.values.tujuan}
                onChange={formik.handleChange}
                error={formik.touched.tujuan && Boolean(formik.errors.tujuan)}
                id={'tujuan'}
                name={'tujuan'}
                rows={4}
                readOnly={type === 'detail'}
                multiline
                fullWidth
              />
              {formik.touched.tujuan && formik.errors.tujuan && <ErrorMessage message={formik.errors.tujuan as string} />}
            </FormControl>
            <FormControl margin={'dense'} fullWidth>
              <InputLabel id={'sasaran_strategis'}>Sasaran Strategis*</InputLabel>
              <Select
                label={'Sasaran Strategis*'}
                labelId={'sasaran'}
                name={'sasaran'}
                value={formik.values.sasaran}
                onChange={formik.handleChange}
                error={formik.touched.sasaran && Boolean(formik.errors.sasaran)}
                readOnly={type === 'detail'}
                fullWidth
              >
                <MenuItem value='Mahasiswa'>Mahasiswa</MenuItem>
              </Select>
              {formik.touched.sasaran && formik.errors.sasaran && <ErrorMessage message={formik.errors.sasaran as string} />}
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
