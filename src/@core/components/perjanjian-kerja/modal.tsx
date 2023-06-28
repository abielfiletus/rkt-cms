import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material'
import { IModalProp } from '../../../configs/modalConfig'
import { apiGet, apiPatch, apiPost } from '../../../util/api-fetch'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import Button from '@mui/material/Button'
import { EditPerjanjianKerjaSchema } from './perjanjian-kerja.schema'
import { useMemo, useState } from 'react'
import LoaderModal from '../modal/loader'
import FileInput from '../file-input'
import { getDocument } from 'pdfjs-dist'

export default function PerjanjianKerjaModal(props: IModalProp) {
  const { id, type, handleClose } = props

  // state
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingText, setIsLoadingText] = useState<boolean>(false)
  const [pk, setPK] = useState('')
  const [data, setData] = useState<Record<string, any>>({})

  const baseUrl = process.env.NEXT_PUBLIC_BE_URL

  useMemo(() => {
    if (id) {
      apiGet('/perjanjian-kerja/' + id).then(res => {
        setIsLoading(false)
        setData(res.data)

        if (res.data?.perjanjian_kerja) {
          formik.setValues({ id: res.data.id, perjanjian_kerja: '' })
          setFiles(baseUrl + '/' + res.data.perjanjian_kerja, setPK).then(() => setIsLoading(false))
        }

        if (res.data && !res.data.perjanjian_kerja) {
          formik.setValues({ id: res.data.id, perjanjian_kerja: '' })
          setIsLoading(false)
        }
      })
    }
  }, [id])

  const formik = useFormik({
    initialValues: { id: data?.id, perjanjian_kerja: '' },
    validationSchema: type === 'ubah' ? EditPerjanjianKerjaSchema : null,
    onSubmit: async values => {
      const baseUrl = '/perjanjian-kerja'
      let fetch

      if (type === 'ubah') fetch = await apiPatch(baseUrl + '/' + data?.id, values)
      else fetch = await apiPost(baseUrl, values)

      if (fetch.code === 422) {
        formik.setErrors(fetch.error)
      } else {
        toast.success(`Berhasil ${type === 'ubah' ? 'Submit' : 'Membuat Data'} Perjanjian Kerja`)
        handleClose(true)
      }
    }
  })

  const setFiles = async (url: string, setterFunc: any) => {
    const pdf = await getDocument(url).promise
    const page = await pdf.getPage(1)
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!

    const viewport = page.getViewport({ scale: 1.0 })
    canvas.width = viewport.width
    canvas.height = viewport.height

    const renderContext = { canvasContext: context, viewport: viewport }

    page.render(renderContext).promise.then(function () {
      const imgData = canvas.toDataURL('image/png')
      setterFunc(imgData)
    })
  }

  const handleChangeFile = async (event: any, field: string, setterFunc: any) => {
    if (event.target.files && event.target.files[0]) {
      const objectUrl = URL.createObjectURL(event.target.files[0])

      const pdf = await getDocument(objectUrl).promise
      const page = await pdf.getPage(1)
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')!

      const viewport = page.getViewport({ scale: 1.0 })
      canvas.width = viewport.width
      canvas.height = viewport.height

      const renderContext = { canvasContext: context, viewport: viewport }

      page.render(renderContext).promise.then(function () {
        const imgData = canvas.toDataURL('image/png')
        setterFunc(imgData)
      })

      await formik.setFieldValue(field, event.target.files[0])
    } else {
      setterFunc('')
      await formik.setFieldValue(field, '')
    }
  }

  const handleClickDownload = async (e: any) => {
    e.preventDefault()
    setIsLoadingText(true)

    const ftch = await fetch(baseUrl + '/' + data?.perjanjian_kerja)
    const fileBlob = await ftch.blob()

    const url = window.URL.createObjectURL(new Blob([fileBlob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Perjanjian Kerja ${data?.rkt_id}.pdf`)

    document.body.appendChild(link)
    link.click()
    link.parentNode?.removeChild(link)

    setIsLoadingText(false)
  }

  return (
    <Dialog open={true} maxWidth={'md'} id={type} fullWidth>
      {isLoading && <LoaderModal />}
      {!isLoading && (
        <>
          <DialogTitle>
            <Typography fontWeight={'bold'} fontSize={23} textTransform={'capitalize'}>
              {type} Penyusunan Usulan RKT
            </Typography>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={formik.handleSubmit} noValidate>
              <Box textAlign={'center'}>
                <FileInput
                  name={'perjanjian_kerja'}
                  error={formik.touched.perjanjian_kerja && formik.errors.perjanjian_kerja}
                  handleChange={event => handleChangeFile(event, 'perjanjian_kerja', setPK)}
                  disabled={type === 'detail'}
                  errorMessage={formik.errors.perjanjian_kerja as string}
                  mimeAccept={'.pdf'}
                  value={pk}
                  paddingTopError={'7px'}
                />
              </Box>
            </form>
          </DialogContent>
          <DialogActions>
            <Grid spacing={2} justifyContent={'right'} marginTop={2} container>
              {type !== 'detail' && (
                <Grid item>
                  {/* @ts-ignore */}
                  <Button onClick={formik.handleSubmit} color={'primary'} variant={'contained'}>
                    SIMPAN
                  </Button>
                </Grid>
              )}
              {type === 'detail' && (
                <Grid item>
                  <Button onClick={handleClickDownload} color={'primary'} variant={'contained'} disabled={isLoadingText}>
                    {isLoadingText && 'DOWNLOADING...'}
                    {!isLoadingText && 'DOWNLOAD'}
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
