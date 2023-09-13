import { Dialog, DialogContent, DialogTitle, useTheme } from '@mui/material'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { useFormik } from 'formik'
import { apiPatch } from '../../../util/api-fetch'
import { useState } from 'react'
import ErrorMessage from '../error-message'
import { verificationPenyusunanRKTSchema } from '../penyusunan-rkt/penyusunan-rkt.schema'

interface IProps {
  type: 'revisi' | 'tolak' | 'setujui'
  handleClose: (hasData: boolean) => any
  id: number
}

const buttonColor = {
  revisi: 'warning',
  tolak: 'error',
  setujui: 'success'
}

const verificationStatus = {
  revisi: 'revision',
  tolak: 'rejected',
  setujui: 'approved'
}

export default function VerificationModal(props: IProps) {
  const { type, handleClose, id } = props

  const [loading, setLoading] = useState<boolean>(false)

  const theme = useTheme()

  const handleCancel = () => handleClose(false)

  const formik = useFormik({
    initialValues: {
      notes: ''
    },
    validationSchema: ['revisi', 'tolak'].includes(type) ? verificationPenyusunanRKTSchema : null,
    onSubmit: async values => {
      setLoading(true)
      await apiPatch('/perjanjian-kerja/verify/' + id, { notes: values.notes, status: verificationStatus[type] })
      setLoading(false)
      handleClose(true)
    }
  })

  return (
    <Dialog open={true} maxWidth={'sm'} fullWidth>
      <DialogTitle>
        <Typography fontWeight={'bold'} fontSize={16} textTransform={'capitalize'}>
          Form Verifikasi {type} Pengajuan PK
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          fontSize: '13px !important',
          '& .MuiTypography-root': { fontSize: '13px !important' },
          '& .MuiInputBase-input': { fontSize: '13px !important' }
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          {type === 'revisi' && (
            <>
              <Typography fontWeight={500} variant={'body2'}>
                Jelaskan perubahan yang ingin dilakukan<span style={{ color: theme.palette.error.main }}>*</span>
              </Typography>
              <FormControl fullWidth>
                <TextField
                  name={'notes'}
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  error={formik.touched.notes && Boolean(formik.errors.notes)}
                  placeholder={'Isikan bagian apa saja yang masih harus diperbaiki'}
                  rows={3}
                  sx={{ fontSize: 11.5 }}
                  multiline
                />
                <ErrorMessage message={formik.errors.notes as string} />
              </FormControl>
            </>
          )}
          {type === 'tolak' && (
            <>
              <Typography>Jelaskan kenapa pengajuan RKT di tolak*</Typography>
              <FormControl fullWidth>
                <TextField
                  name={'notes'}
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  error={formik.touched.notes && Boolean(formik.errors.notes)}
                  placeholder={'Wajib isi alasan pengajuan RKT ditolak'}
                  rows={3}
                  sx={{ fontSize: 11.5 }}
                  multiline
                />
                <ErrorMessage message={formik.errors.notes as string} />
              </FormControl>
            </>
          )}

          {type === 'setujui' && <Typography>Apakah Anda yakin untuk menyetujui pengajuan ini ?</Typography>}
          <Grid justifyContent={'right'} columnSpacing={3} marginTop={7} container>
            <Grid item>
              {/* @ts-ignore */}
              <Button type={'submit'} color={buttonColor[type]} variant={'contained'} sx={{ paddingX: 7 }} disabled={loading}>
                <Typography color={'white'} fontSize={12} fontWeight={'bold'} textTransform={'capitalize'}>
                  {type}
                </Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button
                type={'button'}
                color={'secondary'}
                variant={'contained'}
                sx={{ paddingX: 7, textTransform: 'none' }}
                onClick={handleCancel}
                disabled={loading}
              >
                <Typography color={'white'} fontSize={12} fontWeight={'bold'}>
                  Batal
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  )
}
