import { IModalProp } from '../../../configs/modalConfig'
import { useMemo, useState } from 'react'
import { apiGet, apiPatch, apiPost } from '../../../util/api-fetch'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { EditCapaianSchema } from './capaian.schema'
import { Dialog, DialogActions, DialogContent, DialogTitle, useTheme } from '@mui/material'
import LoaderModal from '../modal/loader'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

export default function CapaianModal(props: IModalProp) {
  const { id, type, handleClose, additional } = props

  // state
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [data, setData] = useState<Record<string, any>>({})
  const [rktIkuHash, setRktIkuHash] = useState<Record<string, any>>({})

  const theme = useTheme()

  useMemo(() => {
    if (id) {
      apiGet('/capaian/' + id).then(res => {
        setIsLoading(false)
        setData(res.data)

        const mapRkt: Record<string, any> = {}
        const values: any[] = []
        res.data?.rkt?.rkt_x_iku?.map((item: Record<string, any>) => (mapRkt[item.iku_id] = item))
        res.data?.capaian_x_iku?.map((item: Record<string, any>) =>
          values.push({
            id_capaian_iku: item.id,
            iku_id: item.iku.id,
            capaian: item[`capaian_${additional}`] || '',
            progress: item[`progress_${additional}`] || '',
            masalah: item[`masalah_${additional}`] || '',
            strategi: item[`strategi_${additional}`] || ''
          })
        )

        setRktIkuHash(mapRkt)
        formik.setValues({ data: values, tw_index: 1 })
      })
    }
  }, [id])

  const formik = useFormik({
    initialValues: { data: [{ id_capaian_iku: '', capaian: '', progress: '', masalah: '', strategi: '' }], tw_index: additional },
    validationSchema: type === 'ubah' ? EditCapaianSchema : null,
    onSubmit: async values => {
      const baseUrl = '/capaian'
      let fetch

      if (type === 'ubah') fetch = await apiPatch(baseUrl + '/' + data?.id, values, {}, false, false)
      else fetch = await apiPost(baseUrl, values, {}, false)

      if (fetch.code === 422) {
        formik.setErrors(fetch.error)
      } else {
        toast.success(`Berhasil ${type === 'ubah' ? 'Submit' : 'Membuat Data'} Capaian`)
        handleClose(true)
      }
    }
  })

  return (
    <Dialog maxWidth={'md'} open={true} fullWidth>
      {isLoading && <LoaderModal />}
      {!isLoading && (
        <>
          <DialogTitle>
            <Typography fontWeight={'bold'} fontSize={23} textTransform={'capitalize'}>
              Input Pengukuran Indikator Kinerja Kegiatan
            </Typography>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={formik.handleSubmit} noValidate>
              <Box paddingX={5}>
                {formik?.values?.data?.map((item: Record<string, any>, i: number) => {
                  const rktIku = rktIkuHash[item?.iku_id]

                  return (
                    <Box mt={i > 0 ? 15 : 0} key={item.id_capaian_iku}>
                      <Grid container>
                        <Grid fontWeight={500} mt={2} md={4} item>
                          Kode IKU
                        </Grid>
                        <Grid md={8} item>
                          {rktIku?.iku?.no}
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid fontWeight={500} mt={2} md={4} item>
                          Uraian IKU
                        </Grid>
                        <Grid md={8} item>
                          {rktIku?.iku?.name}
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid fontWeight={500} mt={2} md={4} item>
                          Periode
                        </Grid>
                        <Grid md={8} item>
                          Triwulan {additional}
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid fontWeight={500} mt={2} md={4} item>
                          Target Yang Diajukan
                        </Grid>
                        <Grid md={8} item>
                          {rktIku?.tw_1}
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid fontWeight={500} mt={2} md={4} item>
                          Capaian Target
                        </Grid>
                        <Grid md={8} item>
                          <TextField
                            variant={'standard'}
                            size={'small'}
                            name={`data.${i}.capaian`}
                            value={item.capaian}
                            onChange={formik.handleChange}
                            error={formik.touched?.data?.[i]?.capaian && Boolean((formik.errors?.data?.[i] as any)?.['capaian'])}
                          />
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid fontWeight={500} mt={2} md={12} item>
                          Progress / Kegiatan <span style={{ color: theme.palette.error.main }}>*</span>
                        </Grid>
                        <Grid md={12} mt={2} item>
                          <FormControl fullWidth>
                            <TextField
                              size={'small'}
                              placeholder={'Progress Kegiatan'}
                              minRows={2}
                              name={`data.${i}.progress`}
                              value={item.progress}
                              onChange={formik.handleChange}
                              error={
                                formik.touched?.data?.[i]?.progress && Boolean((formik.errors?.data?.[i] as any)?.['progress'])
                              }
                              multiline
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid fontWeight={500} mt={2} md={12} item>
                          Kendala / Permasalahan <span style={{ color: theme.palette.error.main }}>*</span>
                        </Grid>
                        <Grid md={12} mt={2} item>
                          <FormControl fullWidth>
                            <TextField
                              size={'small'}
                              placeholder={'Kendala / Permasalahan'}
                              minRows={2}
                              name={`data.${i}.masalah`}
                              value={item.masalah}
                              onChange={formik.handleChange}
                              error={
                                formik.touched?.data?.[i]?.masalah && Boolean((formik.errors?.data?.[i] as any)?.['masalah'])
                              }
                              multiline
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid fontWeight={500} mt={2} md={12} item>
                          Strategi / Tindaklanjut <span style={{ color: theme.palette.error.main }}>*</span>
                        </Grid>
                        <Grid md={12} mt={2} item>
                          <FormControl fullWidth>
                            <TextField
                              size={'small'}
                              placeholder={'Strategi / Tindaklanjut'}
                              minRows={2}
                              name={`data.${i}.strategi`}
                              value={item.strategi}
                              onChange={formik.handleChange}
                              error={
                                formik.touched?.data?.[i]?.strategi && Boolean((formik.errors?.data?.[i] as any)?.['strategi'])
                              }
                              multiline
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Box>
                  )
                })}
              </Box>
            </form>
          </DialogContent>
          <DialogActions>
            <Grid spacing={2} justifyContent={'right'} marginTop={2} container>
              {type !== 'detail' && (
                <Grid item>
                  {/* @ts-ignore */}
                  <Button onClick={formik.handleSubmit} color={'primary'} variant={'contained'}>
                    AJUKAN
                  </Button>
                </Grid>
              )}
              <Grid item>
                <Button type={'button'} variant={'contained'} onClick={() => handleClose(false)} color={'secondary'}>
                  BATAL
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}
