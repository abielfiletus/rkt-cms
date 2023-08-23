// @ts-nocheck

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Dialog, DialogActions, DialogContent, DialogTitle, useTheme } from '@mui/material'
import { IModalProp } from '../../../configs/modalConfig'
import { apiGet, apiPatch, apiPost } from '../../../util/api-fetch'
import FormControl from '@mui/material/FormControl'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import Button from '@mui/material/Button'
import { AddPenyusunanRKTSchema, EditPenyusunanRKTSchema } from './penyusunan-rkt.schema'
import dayjs from 'dayjs'
import { Close, MicrosoftExcel, PlusCircleOutline, TextBoxPlusOutline } from 'mdi-material-ui'
import { useEffect, useState } from 'react'
import LoaderModal from '../modal/loader'
import FileInput from '../file-input'
import { getDocument } from 'pdfjs-dist'
import { currencyFormatter } from '../../../util/functions'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import TextField from '@mui/material/TextField'
import FormRow from '../../../views/form-layouts/form-row'
import InputAdornment from '@mui/material/InputAdornment'
import CustomAutocomplete from '../../../views/form-layouts/custom-autocomplete'
import useMediaQuery from '@mui/material/useMediaQuery'
import IconButton from '@mui/material/IconButton'

export default function PenyusunanRKTModal(props: IModalProp) {
  const { id, type, handleClose } = props

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'))

  // state
  const [isLoading, setIsLoading] = useState<boolean>(type !== 'tambah')
  const [kak, setKak] = useState('')
  const [suratUsulan, setSuratUsulan] = useState('')
  const [referensiHarga, setReferensiHarga] = useState('')
  const [attachment, setAttachment] = useState('')
  const [defaultIkuOption, setDefaultIkuOption] = useState({})
  const [data, setData] = useState<Record<string, any>>({})
  const baseUrl = process.env.NEXT_PUBLIC_BE_URL

  const formatIkuData = async (iku_data: Array<Record<string, any>>) => {
    const formatted = []

    for (const data of iku_data || []) {
      const res = {
        iku_id: data.iku_id,
        total: data.total,
        tw_1: data.tw_1,
        tw_2: data.tw_2,
        tw_3: data.tw_3,
        tw_4: data.tw_4,
        aksi_data: []
      }

      data.iku_x_aksi.map(({ rencana_aksi }) => {
        res.aksi_data.push({ rencana_aksi })
      })

      formatted.push(res)
    }

    return formatted
  }

  const formatRabData = async (rab_data: Array<Record<string, any>>) => {
    return rab_data?.map(({ name, unit, price }) => {
      return { name, unit, price: currencyFormatter.format(price) }
    })
  }

  const formatData = async (data: Record<string, any>) => {
    if (Object.keys(data).length) {
      const [iku_data, rab_data] = await Promise.all([formatIkuData(data.rkt_x_iku), formatRabData(data.rkt_x_rab)])

      await formik.setValues({
        id: data.id,
        tahun: dayjs(data.tahun, 'YYYY'),
        tahun_renstra: data.rencana_strategi?.tahun,
        name: data.name,
        target_perjanjian_kerja: data.target_perjanjian_kerja,
        usulan_anggaran: currencyFormatter.format(data.usulan_anggaran),
        iku_data: iku_data,
        rab_data: rab_data,
        surat_usulan: baseUrl + '/' + data.surat_usulan,
        kak: baseUrl + '/' + data.kak,
        referensi_harga: baseUrl + '/' + data.referensi_harga,
        pendukung: baseUrl + '/' + data.pendukung,
        submit_by: userId
      })

      const ikuIds = [...new Set(iku_data?.map(iku => iku.iku_id))]

      if (ikuIds?.length) {
        const getOptions = await apiGet('/indikator-kinerja-utama/multiple?id=' + ikuIds.join(','))

        const hashing = {}
        getOptions.data?.map(item => (hashing[item.id] = item))
        setDefaultIkuOption(hashing)
      }

      setData(data)
      setIsLoading(false)

      if (data.kak) {
        const fileUrl = baseUrl + '/' + data.kak
        const split = data.kak.split('.')
        if (split[split.length - 1] === 'pdf') await setFiles(fileUrl, setKak)
        else setKak(fileUrl)
      }
      if (data.surat_usulan) {
        const fileUrl = baseUrl + '/' + data.surat_usulan
        const split = data.surat_usulan.split('.')
        if (split[split.length - 1] === 'pdf') await setFiles(fileUrl, setSuratUsulan)
        else setSuratUsulan(fileUrl)
      }
      if (data.referensi_harga) {
        const fileUrl = baseUrl + '/' + data.referensi_harga
        const split = data.referensi_harga.split('.')
        if (split[split.length - 1] === 'pdf') await setFiles(fileUrl, setReferensiHarga)
        else setReferensiHarga(fileUrl)
      }
      if (data.pendukung) {
        const fileUrl = baseUrl + '/' + data.pendukung
        const split = data.pendukung.split('.')
        if (split[split.length - 1] === 'pdf') await setFiles(fileUrl, setAttachment)
        else setAttachment(fileUrl)
      }
    }
  }

  useEffect(() => {
    if (id) {
      apiGet('/penyusunan-rkt/' + id).then(res => formatData(res.data))
    }
  }, [id])

  const userProdi = JSON.parse(window.localStorage.getItem('prodi') || '{}')
  const userId = window.localStorage.getItem('id')

  const defaultAksiData = {
    rencana_aksi: ''
  }

  const defaultIku = [
    {
      iku_id: '',
      tw_1: '',
      tw_2: '',
      tw_3: '',
      tw_4: '',
      total: 0,
      aksi_data: [defaultAksiData]
    }
  ]
  const defaultRab = [
    {
      name: '',
      unit: '',
      price: ''
    }
  ]

  const formik = useFormik({
    initialValues: {
      id: '',
      tahun: dayjs(),
      name: '',
      satuan_kerja: '',
      target_perjanjian_kerja: '',
      usulan_anggaran: '',
      iku_data: defaultIku as Array<Record<string, any>>,
      rab_data: defaultRab as Array<Record<string, any>>,
      surat_usulan: '',
      kak: '',
      referensi_harga: '',
      pendukung: '',
      submit_by: userId
    },
    validationSchema: type === 'tambah' ? AddPenyusunanRKTSchema : type === 'ubah' ? EditPenyusunanRKTSchema : null,
    onSubmit: async values => {
      let fetch

      values.usulan_anggaran = values.usulan_anggaran.replace(/[RpNa\s\.]/g, '')
      values.rab_data = values.rab_data.map(data => {
        return { ...data, price: data.price.replace(/[RpNa\s\.]/g, '') }
      })

      values.tahun = dayjs(values.tahun).format('YYYY')

      if (type === 'ubah') {
        fetch = await apiPatch('/penyusunan-rkt/' + data?.id, {
          ...values,
          rab_data: JSON.stringify(values.rab_data),
          iku_data: JSON.stringify(values.iku_data)
        })
      } else {
        fetch = await apiPost('/penyusunan-rkt', {
          ...values,
          rab_data: JSON.stringify(values.rab_data),
          iku_data: JSON.stringify(values.iku_data)
        })
      }

      if (fetch.code === 422) {
        formik.setErrors(fetch.error)
      } else if (fetch.code === 500) {
        toast.error('Ada yang salah dengan server. Silahkan coba lagi')
      } else {
        toast.success(`Berhasil ${type === 'ubah' ? 'Mengubah Data' : 'Membuat Data'} RKT`)
        handleClose(true)
      }
    }
  })

  const setFiles = async (url: string, setterFunc) => {
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

  // click handler
  const handleTwChange = (i: number) => {
    const tw_1 = formik.values['iku_data'][i]['tw_1'] || 0
    const tw_2 = formik.values['iku_data'][i]['tw_2'] || 0
    const tw_3 = formik.values['iku_data'][i]['tw_3'] || 0
    const tw_4 = formik.values['iku_data'][i]['tw_4'] || 0

    formik.setFieldValue(`iku_data.${i}.total`, tw_1 + tw_2 + tw_3 + tw_4)
  }
  const handleAddIku = () => {
    formik.setFieldValue('iku_data', [...formik.values.iku_data, ...defaultIku])
  }
  const handleAddIkuAksi = (i: number) => {
    const lastValue = formik.values.iku_data[i]?.aksi_data || []
    formik.setFieldValue(`iku_data.${i}.aksi_data`, [...lastValue, defaultAksiData])
  }
  const handleAddRab = () => {
    formik.setFieldValue('rab_data', [...formik.values.rab_data, ...defaultIku])
  }
  const handleRemoveIku = (i: number) => {
    formik.values.iku_data.splice(i, 1)
    formik.setFieldValue('iku_data', formik.values.iku_data)
  }
  const handleRemoveIkuAksi = (i: number, j: number) => {
    formik.values.iku_data[i]?.aksi_data?.splice(j, 1)
    formik.setFieldValue(`iku_data.${i}.aksi_data`, formik.values.iku_data[i]?.aksi_data)
  }
  const handleRemoveRab = (i: number) => {
    formik.values.rab_data.splice(i, 1)
    formik.setFieldValue('rab_data', formik.values.rab_data)
  }
  const handleChangeFile = async (event: any, field: string, setterFunc) => {
    if (event.target.files && event.target.files[0]) {
      const objectUrl = URL.createObjectURL(event.target.files[0])

      if (event.target.files[0]?.type === 'application/pdf') {
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
      } else {
        if (objectUrl) setterFunc(objectUrl)
      }

      await formik.setFieldValue(field, event.target.files[0])
    } else {
      setterFunc('')
      await formik.setFieldValue(field, '')
    }
  }

  return (
    <Dialog open={true} maxWidth={'md'} id={type} fullWidth>
      {isLoading && <LoaderModal />}
      {!isLoading && (
        <>
          <DialogTitle>
            <Typography
              fontWeight={'bold'}
              fontSize={23}
              textTransform={'capitalize'}
              sx={{ [theme.breakpoints.only('xs')]: { fontSize: 18 } }}
            >
              {type} Penyusunan Usulan RKT
            </Typography>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={formik.handleSubmit} noValidate>
              <Box sx={{ fontSize: '13px !important', '& input': { fontSize: '13px !important' } }}>
                <FormRow
                  id={'jurusan-pengusul'}
                  label={'Jurusan Pengusul'}
                  errors={formik.errors}
                  formikField={'jurusan-pengusul'}
                  boxSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                  boxGrid={4}
                  contentGrid={8}
                  contentSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                  content={
                    <Typography
                      color={theme.palette.grey['500']}
                      fontSize={13}
                      marginTop={2}
                      mb={2}
                      sx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                    >
                      {userProdi.name}
                    </Typography>
                  }
                />
                <FormRow
                  id={'tahun'}
                  label={'Tahun Usulan'}
                  errors={formik.errors}
                  formikField={'tahun'}
                  boxSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                  boxGrid={4}
                  contentGrid={8}
                  content={
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        disabled={type === 'detail'}
                        id='year-picker'
                        openTo={'year'}
                        format={'YYYY'}
                        value={formik.values.tahun}
                        sx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                        onChange={value => formik.setFieldValue('tahun', value)}
                      />
                    </LocalizationProvider>
                  }
                  contentSx={{
                    [theme.breakpoints.only('xs')]: { fontSize: 11 },
                    '& .MuiInputBase-root': { borderRadius: '0', width: 120 },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderTopColor: 'transparent !important',
                      borderLeftColor: 'transparent !important',
                      borderRightColor: 'transparent !important'
                    },
                    '& input': { padding: 2, paddingLeft: 0 }
                  }}
                />
                <FormRow
                  id={'name'}
                  label={'Nama Usulan Kegiatan'}
                  errors={formik.errors}
                  formikField={'name'}
                  boxSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                  boxGrid={4}
                  contentGrid={8}
                  contentSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                  content={
                    <FormControl fullWidth>
                      <TextField
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        variant={'standard'}
                        id={'name'}
                        name={'name'}
                        disabled={type === 'detail'}
                        sx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                      />
                    </FormControl>
                  }
                />
                <FormRow
                  id={'usulan_anggaran'}
                  label={'Usulan Anggaran'}
                  errors={formik.errors}
                  formikField={'usulan_anggaran'}
                  boxSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                  boxGrid={4}
                  contentGrid={8}
                  contentSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                  content={
                    <TextField
                      value={formik.values.usulan_anggaran}
                      onChange={e => {
                        const value = e.currentTarget.value?.replace(/[RpNa\s\.]+/g, '')
                        formik.setFieldValue(`usulan_anggaran`, currencyFormatter.format(value))
                      }}
                      error={formik.touched.usulan_anggaran && Boolean(formik.errors.usulan_anggaran)}
                      variant={'standard'}
                      id={'usulan_anggaran'}
                      name={'usulan_anggaran'}
                      disabled={type === 'detail'}
                      sx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                    />
                  }
                />
                <FormRow
                  id={'target_perjanjian_kerja'}
                  label={'Target Perjanjian Kerja'}
                  errors={formik.errors}
                  formikField={'target_perjanjian_kerja'}
                  boxSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                  boxGrid={4}
                  contentGrid={8}
                  contentSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                  content={
                    <TextField
                      value={formik.values.target_perjanjian_kerja}
                      onChange={formik.handleChange}
                      error={formik.touched.target_perjanjian_kerja && Boolean(formik.errors.target_perjanjian_kerja)}
                      variant={'standard'}
                      id={'target_perjanjian_kerja'}
                      name={'target_perjanjian_kerja'}
                      type={'number'}
                      disabled={type === 'detail'}
                      InputProps={{
                        endAdornment: <InputAdornment position='start'>%</InputAdornment>
                      }}
                      sx={{
                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                          display: 'none'
                        },
                        '& input[type=number]': {
                          MozAppearance: 'textfield'
                        },
                        [theme.breakpoints.only('xs')]: { fontSize: 11 }
                      }}
                    />
                  }
                />
              </Box>
              <Box sx={{ fontSize: '13px !important', marginTop: 8, '& input': { fontSize: '13px !important' } }}>
                <Box border={'1px solid #3e495473'} borderRadius={'5px'} padding={2}>
                  <Button
                    type={'button'}
                    color={'info'}
                    variant={'contained'}
                    sx={{ borderRadius: 30, height: 35, marginBottom: 1 }}
                    onClick={handleAddIku}
                    disabled={type === 'detail'}
                  >
                    <Grid alignItems={'center'} container>
                      <Grid mt={1.2} item>
                        <TextBoxPlusOutline
                          sx={{ color: 'white', [theme.breakpoints.only('xs')]: { fontSize: 13 } }}
                          fontSize={'small'}
                        />
                      </Grid>
                      <Grid item ml={2}>
                        <Typography
                          color={'white'}
                          fontSize={12}
                          fontWeight={'bold'}
                          sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 } }}
                        >
                          Tambah IKU
                        </Typography>
                      </Grid>
                    </Grid>
                  </Button>
                  {formik.values.iku_data.map((iku, i) => {
                    return (
                      <Box marginTop={2} key={i}>
                        <Grid pl={1} columnSpacing={3} container>
                          <Grid sm={10} xs={12} item>
                            <FormRow
                              id={`iku_data.${i}.iku_id`}
                              label={`INDIKATOR KINERJA UTAMA ${i + 1}`}
                              boxSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                              boxGrid={isMobile ? 12 : 4}
                              contentGrid={isMobile ? 12 : 8}
                              contentSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                              content={
                                <CustomAutocomplete
                                  url={'/indikator-kinerja-utama'}
                                  apiFieldKey={'name'}
                                  onChange={value => {
                                    formik.setFieldValue(`iku_data.${i}.iku_id`, value)
                                  }}
                                  labelFieldKey={['no', 'name']}
                                  valueFieldKey={'id'}
                                  defaultValue={defaultIkuOption[iku.iku_id]}
                                  disabled={type === 'detail'}
                                  sx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                                  limit={15}
                                />
                              }
                              errors={formik.errors}
                              formikField={`iku_data.${i}.iku_id`}
                            />
                          </Grid>
                          <Grid sm={2} item>
                            {i > 0 && (
                              <Button
                                type={'button'}
                                color={'error'}
                                variant={'contained'}
                                sx={{ borderRadius: 30, height: 30, marginTop: 2, fontSize: 13 }}
                                disabled={type === 'detail'}
                              >
                                <Grid alignItems={'center'} container>
                                  <Grid md={1} mt={1.2} item>
                                    <Close sx={{ color: 'white' }} fontSize={'13'} />
                                  </Grid>
                                  <Grid item ml={2}>
                                    <Typography
                                      color={'white'}
                                      fontSize={isMobile ? 11 : 12}
                                      fontWeight={'bold'}
                                      onClick={() => handleRemoveIku(i)}
                                    >
                                      Hapus IKU
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                        <Box>
                          <Grid marginTop={3} width={'83.333333%'} container>
                            <Grid sm={4} item>
                              <Box marginTop={2} fontWeight={500}>
                                {`Target IKU ${i + 1}`} <span style={{ color: theme.palette.error.main }}>*</span>
                              </Box>
                            </Grid>
                            <Grid sm={8} item>
                              <Grid justifyContent={'space-between'} rowSpacing={2} container>
                                <Grid md={2} sm={3} item>
                                  <Box display={'flex'}>
                                    <p
                                      style={{
                                        fontWeight: 500,
                                        marginRight: 10,
                                        marginTop: 7,
                                        fontSize: isMobile ? 11 : 'inherit'
                                      }}
                                    >
                                      TW1
                                    </p>
                                    <TextField
                                      value={iku.tw_1}
                                      id={`iku_data.${i}.tw_1`}
                                      name={`iku_data.${i}.tw_1`}
                                      onChange={formik.handleChange}
                                      sx={{
                                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                          display: 'none'
                                        },
                                        '& input[type=number]': {
                                          MozAppearance: 'textfield',
                                          padding: 2
                                        },
                                        [theme.breakpoints.only('xs')]: { fontSize: 11 }
                                      }}
                                      onKeyUp={() => handleTwChange(i)}
                                      size={'small'}
                                      type={'number'}
                                      InputProps={{ inputProps: { min: 0 } }}
                                      error={
                                        formik.touched['iku_data']?.length &&
                                        formik.errors['iku_data']?.length &&
                                        formik.touched['iku_data'][i] &&
                                        formik.errors['iku_data'][i] &&
                                        formik.touched['iku_data'][i]['tw_1'] &&
                                        Boolean(formik.errors['iku_data'][i]['tw_1'])
                                      }
                                      disabled={type === 'detail'}
                                    />
                                  </Box>
                                </Grid>
                                <Grid md={2} sm={3} item>
                                  <Box display={'flex'}>
                                    <p
                                      style={{
                                        fontWeight: 500,
                                        marginRight: 10,
                                        marginTop: 8,
                                        fontSize: isMobile ? 11 : 'inherit'
                                      }}
                                    >
                                      TW2
                                    </p>
                                    <TextField
                                      value={iku.tw_2}
                                      id={`iku_data.${i}.tw_2`}
                                      name={`iku_data.${i}.tw_2`}
                                      onChange={formik.handleChange}
                                      sx={{
                                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                          display: 'none'
                                        },
                                        '& input[type=number]': {
                                          MozAppearance: 'textfield',
                                          padding: 2
                                        }
                                      }}
                                      onKeyUp={() => handleTwChange(i)}
                                      size={'small'}
                                      type={'number'}
                                      InputProps={{ inputProps: { min: 0 } }}
                                      error={
                                        formik.touched['iku_data']?.length &&
                                        formik.errors['iku_data']?.length &&
                                        formik.touched['iku_data'][i] &&
                                        formik.errors['iku_data'][i] &&
                                        formik.touched['iku_data'][i]['tw_2'] &&
                                        Boolean(formik.errors['iku_data'][i]['tw_2'])
                                      }
                                      disabled={type === 'detail'}
                                    />
                                  </Box>
                                </Grid>
                                <Grid md={2} sm={3} item>
                                  <Box display={'flex'}>
                                    <p
                                      style={{
                                        fontWeight: 500,
                                        marginRight: 10,
                                        marginTop: 8,
                                        fontSize: isMobile ? 11 : 'inherit'
                                      }}
                                    >
                                      TW3
                                    </p>
                                    <TextField
                                      value={iku.tw_3}
                                      id={`iku_data.${i}.tw_3`}
                                      name={`iku_data.${i}.tw_3`}
                                      onChange={formik.handleChange}
                                      sx={{
                                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                          display: 'none'
                                        },
                                        '& input[type=number]': {
                                          MozAppearance: 'textfield',
                                          padding: 2
                                        }
                                      }}
                                      onKeyUp={() => handleTwChange(i)}
                                      size={'small'}
                                      type={'number'}
                                      InputProps={{ inputProps: { min: 0 } }}
                                      error={
                                        formik.touched['iku_data']?.length &&
                                        formik.errors['iku_data']?.length &&
                                        formik.touched['iku_data'][i] &&
                                        formik.errors['iku_data'][i] &&
                                        formik.touched['iku_data'][i]['tw_3'] &&
                                        Boolean(formik.errors['iku_data'][i]['tw_3'])
                                      }
                                      disabled={type === 'detail'}
                                    />
                                  </Box>
                                </Grid>
                                <Grid md={2} sm={3} item>
                                  <Box display={'flex'}>
                                    <p
                                      style={{
                                        fontWeight: 500,
                                        marginRight: 10,
                                        marginTop: 8,
                                        fontSize: isMobile ? 11 : 'inherit'
                                      }}
                                    >
                                      TW4
                                    </p>
                                    <TextField
                                      value={iku.tw_4}
                                      id={`iku_data.${i}.tw_4`}
                                      name={`iku_data.${i}.tw_4`}
                                      onChange={formik.handleChange}
                                      sx={{
                                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                          display: 'none'
                                        },
                                        '& input[type=number]': {
                                          MozAppearance: 'textfield',
                                          padding: 2
                                        }
                                      }}
                                      onKeyUp={() => handleTwChange(i)}
                                      size={'small'}
                                      type={'number'}
                                      InputProps={{ inputProps: { min: 0 } }}
                                      error={
                                        formik.touched['iku_data']?.length &&
                                        formik.errors['iku_data']?.length &&
                                        formik.touched['iku_data'][i] &&
                                        formik.errors['iku_data'][i] &&
                                        formik.touched['iku_data'][i]['tw_4'] &&
                                        Boolean(formik.errors['iku_data'][i]['tw_4'])
                                      }
                                      disabled={type === 'detail'}
                                    />
                                  </Box>
                                </Grid>
                                <Grid md={2} xs={12} item>
                                  <Box display={'flex'}>
                                    <p
                                      style={{
                                        fontWeight: 500,
                                        marginRight: 10,
                                        marginTop: 8,
                                        fontSize: isMobile ? 11 : 'inherit'
                                      }}
                                    >
                                      Total
                                    </p>
                                    <p style={{ fontWeight: 500, marginTop: 8 }}>{iku.total}</p>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Box>
                        <Box>
                          {(iku.aksi_data as Array<Record<string, any>>).map((aksi, j) => {
                            return (
                              <Box key={j + 1}>
                                <Grid spacing={2} columnSpacing={5} container>
                                  <Grid sm={10} xs={12} item>
                                    <FormRow
                                      id={`iku_data.${i}.aksi_data.${j}.rencana_aksi`}
                                      label={`Rencana Aksi ${j + 1}`}
                                      errors={formik.errors}
                                      formikField={`iku_data.${i}.aksi_data.${j}.rencana_aksi`}
                                      boxSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                                      boxGrid={isMobile ? 12 : 4}
                                      contentGrid={isMobile ? 12 : 8}
                                      contentSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                                      content={
                                        <FormControl fullWidth>
                                          <TextField
                                            value={aksi.rencana_aksi}
                                            id={`iku_data.${i}.aksi_data.${j}.rencana_aksi`}
                                            name={`iku_data.${i}.aksi_data.${j}.rencana_aksi`}
                                            onChange={formik.handleChange}
                                            variant={'standard'}
                                            error={
                                              formik.touched['iku_data']?.length &&
                                              formik.errors['iku_data']?.length &&
                                              formik.touched['iku_data'][i] &&
                                              formik.errors['iku_data'][i] &&
                                              formik.touched['iku_data'][i]['aksi_data'] &&
                                              formik.errors['iku_data'][i]['aksi_data'] &&
                                              formik.touched['iku_data'][i]['aksi_data'][j] &&
                                              formik.errors['iku_data'][i]['aksi_data'][j] &&
                                              formik.touched['iku_data'][i]['aksi_data'][j]['rencana_aksi'] &&
                                              Boolean(formik.errors['iku_data'][i]['aksi_data'][j]['rencana_aksi'])
                                            }
                                            inputProps={{
                                              style: { fontSize: 13, [theme.breakpoints.only('xs')]: { fontSize: 11 } }
                                            }}
                                            disabled={type === 'detail'}
                                            rows={5}
                                            multiline
                                          />
                                        </FormControl>
                                      }
                                    />
                                  </Grid>
                                  <Grid sm={2} item>
                                    {j > 0 && (
                                      <Button
                                        type={'button'}
                                        color={'error'}
                                        variant={'contained'}
                                        sx={{ borderRadius: 30, height: 30, marginTop: 2, fontSize: isMobile ? 11 : 13 }}
                                        onClick={() => handleRemoveIkuAksi(i, j)}
                                        disabled={type === 'detail'}
                                      >
                                        <Grid alignItems={'center'} container>
                                          <Grid mt={1.2} item>
                                            <Close sx={{ color: 'white' }} fontSize={isMobile ? '11' : '13'} />
                                          </Grid>
                                          <Grid item ml={2}>
                                            <Typography color={'white'} fontSize={isMobile ? 11 : 12} fontWeight={'bold'}>
                                              Hapus
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </Button>
                                    )}
                                  </Grid>
                                </Grid>
                              </Box>
                            )
                          })}
                        </Box>
                        <Grid width={'83.333333%'} container>
                          <Grid sm={4} item></Grid>
                          <Grid item>
                            <Button
                              type={'button'}
                              variant={'contained'}
                              sx={{
                                borderRadius: 30,
                                height: 35,
                                marginBottom: 2,
                                bgcolor: '#65eb92',
                                fontSize: isMobile ? 11 : 14,
                                marginTop: 4,
                                ':hover': { bgcolor: '#65eb92' }
                              }}
                              onClick={() => handleAddIkuAksi(i)}
                              disabled={type === 'detail'}
                            >
                              <Grid alignItems={'center'} container>
                                <Grid mt={1.2} item>
                                  <PlusCircleOutline sx={{ color: 'white' }} fontSize={isMobile ? 'small' : 'medium'} />
                                </Grid>
                                <Grid item ml={2}>
                                  <Typography color={'white'} fontSize={isMobile ? 11 : 12} fontWeight={'bold'}>
                                    Tambah Rencana Aksi
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
              <Box sx={{ fontSize: '13px !important', marginTop: 5, '& input': { fontSize: '13px !important' } }}>
                <Box border={'1px solid #3e495473'} borderRadius={'5px'} padding={2}>
                  <Button
                    type={'button'}
                    color={'warning'}
                    variant={'contained'}
                    sx={{ borderRadius: 30, height: 40, marginBottom: 2 }}
                    onClick={handleAddRab}
                    disabled={type === 'detail'}
                  >
                    <Grid alignItems={'center'} container>
                      <Grid mt={1.2} item>
                        <TextBoxPlusOutline sx={{ color: 'white' }} fontSize={'small'} />
                      </Grid>
                      <Grid item ml={2}>
                        <Typography color={'white'} fontSize={isMobile ? 10 : 12} fontWeight={'bold'}>
                          Tambah RAB
                        </Typography>
                      </Grid>
                    </Grid>
                  </Button>
                  {formik.values.rab_data?.map((rab, i) => {
                    return (
                      <Box key={i} marginTop={i === 0 ? 2 : 7}>
                        <Grid spacing={2} columnSpacing={6} container>
                          <Grid sm={10} item>
                            <FormRow
                              id={`rab_data.${i}.name`}
                              label={`Nama Rincian ${i + 1}`}
                              errors={formik.errors}
                              formikField={`rab_data.${i}.name`}
                              boxSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                              boxGrid={isMobile ? 12 : 4}
                              contentGrid={isMobile ? 12 : 8}
                              contentSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                              content={
                                <FormControl fullWidth>
                                  <TextField
                                    value={rab.name}
                                    id={`rab_data.${i}.name`}
                                    name={`rab_data.${i}.name`}
                                    onChange={formik.handleChange}
                                    variant={'standard'}
                                    error={
                                      formik.touched['rab_data']?.length &&
                                      formik.errors['rab_data']?.length &&
                                      formik.touched['rab_data'][i]?.name &&
                                      Boolean(formik.errors['rab_data'][i]?.name)
                                    }
                                    disabled={type === 'detail'}
                                  />
                                </FormControl>
                              }
                            />
                            <FormRow
                              id={`rab_data.${i}.unit`}
                              label={`Unit ${i + 1}`}
                              errors={formik.errors}
                              formikField={`rab_data.${i}.unit`}
                              boxSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                              boxGrid={isMobile ? 12 : 4}
                              contentGrid={isMobile ? 12 : 8}
                              contentSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                              content={
                                <FormControl fullWidth>
                                  <TextField
                                    variant={'standard'}
                                    value={rab.unit}
                                    id={`rab_data.${i}.unit`}
                                    name={`rab_data.${i}.unit`}
                                    onChange={formik.handleChange}
                                    error={
                                      formik.touched['rab_data']?.length &&
                                      formik.errors['rab_data']?.length &&
                                      formik.touched['rab_data'][i]?.unit &&
                                      Boolean(formik.errors['rab_data'][i]?.unit)
                                    }
                                    disabled={type === 'detail'}
                                  />
                                </FormControl>
                              }
                            />
                            <FormRow
                              id={`rab_data.${i}.price`}
                              label={`Harga ${i + 1}`}
                              errors={formik.errors}
                              formikField={`rab_data.${i}.price`}
                              boxSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                              boxGrid={isMobile ? 12 : 4}
                              contentGrid={isMobile ? 12 : 8}
                              contentSx={{ [theme.breakpoints.only('xs')]: { fontSize: 11 } }}
                              content={
                                <FormControl fullWidth>
                                  <TextField
                                    variant={'standard'}
                                    value={rab.price}
                                    id={`rab_data.${i}.price`}
                                    name={`rab_data.${i}.price`}
                                    onChange={e => {
                                      const value = e.currentTarget.value?.replace(/[RpNa\s\.]+/g, '')
                                      formik.setFieldValue(`rab_data.${i}.price`, currencyFormatter.format(value))
                                    }}
                                    error={
                                      formik.touched['rab_data']?.length &&
                                      formik.errors['rab_data']?.length &&
                                      formik.touched['rab_data'][i]?.price &&
                                      Boolean(formik.errors['rab_data'][i]?.price)
                                    }
                                    disabled={type === 'detail'}
                                  />
                                </FormControl>
                              }
                            />
                          </Grid>
                          <Grid sm={2} item>
                            {i > 0 && (
                              <Button
                                type={'button'}
                                color={'error'}
                                variant={'contained'}
                                sx={{ borderRadius: 30, height: 30, marginTop: 2 }}
                                onClick={() => handleRemoveRab(i)}
                                disabled={type === 'detail'}
                              >
                                <Grid alignItems={'center'} container>
                                  <Grid mt={1.2} item>
                                    <Close sx={{ color: 'white' }} fontSize={'small'} />
                                  </Grid>
                                  <Grid item ml={2}>
                                    <Typography color={'white'} fontSize={isMobile ? 11 : 12} fontWeight={'bold'}>
                                      Hapus
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
              <Box marginTop={5}>
                <Typography lineHeight={0.5} fontWeight={500} fontSize={isMobile ? 11 : 14}>
                  UPLOAD FILE PENDUKUNG
                </Typography>
                <Typography fontStyle={'italic'} color={theme.palette.error.main} fontSize={isMobile ? 9 : 11}>
                  *Upload file dalam format PDF
                </Typography>

                <Grid spacing={3} columnSpacing={6} marginTop={2} container>
                  <Grid item>
                    <Typography fontSize={isMobile ? 11 : 13} textAlign={'center'} fontWeight={500}>
                      Surat Usulan <span style={{ color: theme.palette.error.main }}>*</span>
                    </Typography>
                    <FileInput
                      name={'surat_usulan'}
                      error={formik.errors.surat_usulan}
                      handleChange={event => handleChangeFile(event, 'surat_usulan', setSuratUsulan)}
                      disabled={type === 'detail'}
                      errorMessage={formik.errors.surat_usulan}
                      mimeAccept={'.pdf'}
                      value={suratUsulan}
                      width={100}
                      height={100}
                      showErrorMessage={false}
                      url={formik.values.surat_usulan}
                    />
                  </Grid>
                  <Grid item>
                    <Typography fontSize={isMobile ? 11 : 13} textAlign={'center'} fontWeight={500}>
                      KAK <span style={{ color: theme.palette.error.main }}>*</span>
                    </Typography>
                    <FileInput
                      name={'kak'}
                      error={Boolean(formik.errors.kak)}
                      handleChange={event => handleChangeFile(event, 'kak', setKak)}
                      disabled={type === 'detail'}
                      errorMessage={formik.errors.kak}
                      mimeAccept={'.pdf'}
                      value={kak}
                      width={100}
                      height={100}
                      showErrorMessage={false}
                      url={formik.values.kak}
                    />
                  </Grid>
                  <Grid item>
                    <Typography fontSize={isMobile ? 11 : 13} textAlign={'center'} fontWeight={500}>
                      Referensi Harga <span style={{ color: theme.palette.error.main }}>*</span>
                    </Typography>
                    <FileInput
                      name={'referensi_harga'}
                      error={Boolean(formik.errors.referensi_harga)}
                      handleChange={event => handleChangeFile(event, 'referensi_harga', setReferensiHarga)}
                      disabled={type === 'detail'}
                      errorMessage={formik.errors.referensi_harga}
                      mimeAccept={'.pdf'}
                      value={referensiHarga}
                      width={100}
                      height={100}
                      showErrorMessage={false}
                      url={formik.values.referensi_harga}
                    />
                  </Grid>
                  <Grid item>
                    <Typography fontSize={isMobile ? 11 : 13} textAlign={'center'} fontWeight={500}>
                      Pendukung Lain <span style={{ color: theme.palette.error.main }}>*</span>
                    </Typography>
                    <FileInput
                      name={'pendukung'}
                      error={Boolean(formik.errors.pendukung)}
                      handleChange={event => handleChangeFile(event, 'pendukung', setAttachment)}
                      disabled={type === 'detail'}
                      errorMessage={formik.errors.pendukung}
                      mimeAccept={'.pdf'}
                      value={attachment}
                      width={100}
                      height={100}
                      showErrorMessage={false}
                      url={formik.values.pendukung}
                    />
                  </Grid>
                  {data?.excel_rab && (
                    <Grid item>
                      <Typography fontSize={isMobile ? 11 : 13} textAlign={'center'} fontWeight={500}>
                        Excel RAB
                      </Typography>
                      <Box
                        width={100}
                        height={100}
                        border={1}
                        borderColor={theme.palette.grey['400']}
                        borderRadius={1}
                        mt={5}
                        boxShadow={theme.shadows['3']}
                        onClick={() => window.open(baseUrl + '/' + data?.excel_rab, '_blank')}
                        sx={{ cursor: 'pointer' }}
                        pt={7}
                        pl={7}
                      >
                        <MicrosoftExcel fontSize={'large'} color={'success'} />
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </form>
          </DialogContent>
          <DialogActions>
            <Grid spacing={2} justifyContent={'right'} marginTop={2} container>
              {type !== 'detail' && (
                <Grid item>
                  <Button onClick={formik.handleSubmit} color={'primary'} variant={'contained'} disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? 'MENGIRIM...' : 'SIMPAN'}
                  </Button>
                </Grid>
              )}
              <Grid item>
                <Button
                  type={'button'}
                  variant={'contained'}
                  onClick={() => handleClose(false)}
                  color={'secondary'}
                  disabled={formik.isSubmitting}
                >
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
