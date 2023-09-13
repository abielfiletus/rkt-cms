import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Dialog, DialogContent, DialogTitle, OutlinedInput, Select } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'
import { IModalProp } from '../../../configs/modalConfig'
import { apiGet, apiPatch, apiPost } from '../../../util/api-fetch'
import LoaderPage from '../../../views/loader'
import FormControl from '@mui/material/FormControl'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { AddUserSchema, EditUserSchema } from './user.schema'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import Button from '@mui/material/Button'
import ErrorMessage from '../error-message'
import AvatarInput from '../avatar-input'
import CustomInputLabel from '../../../views/form-layouts/custom-input-label'

export default function UserModal(props: IModalProp) {
  const { data, type, handleClose } = props

  //State
  const [role, setRole] = useState<Array<Record<string, any>>>([])
  const [department, setDepartment] = useState<Array<Record<string, any>>>([])
  const [prodi, setProdi] = useState<Array<Record<string, any>>>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [avatar, setAvatar] = useState('/images/avatars/1.png')
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const fetchMasterData = async () => {
    const [role, department, prodi] = await Promise.all([apiGet('/role'), apiGet('/department'), apiGet('/prodi')])

    setRole(role?.data?.data)
    setDepartment(department?.data?.data)
    setProdi(prodi?.data?.data)
    setIsLoading(false)
  }

  useState(() => {
    if (data?.avatar) {
      setAvatar(process.env.NEXT_PUBLIC_BE_URL + '/' + data?.avatar)
    }

    if (type !== 'detail') {
      fetchMasterData()
    } else {
      setIsLoading(false)
    }

    // @ts-ignore
  }, [])

  const formik = useFormik({
    initialValues: {
      id: data?.id || '',
      role_id: data?.role_id || '',
      avatar: '',
      department_id: data?.department_id || '',
      kode_prodi: data?.kode_prodi || '',
      nip: data?.nip || '',
      name: data?.name || '',
      email: data?.email || '',
      password: '',
      confirmation_password: ''
    },
    validationSchema: type === 'tambah' ? AddUserSchema : EditUserSchema,
    onSubmit: async values => {
      const baseUrl = '/user'
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

  const handleChangeAvatar = (event: any) => {
    const objectUrl = URL.createObjectURL(event.target.files[0])
    if (objectUrl) setAvatar(objectUrl)
    formik.setFieldValue('avatar', event.target.files[0])
  }

  const handleChangeNip = (event: any) => {
    const regex = /^[0-9\b]+$/
    if (event.target.value === '' || regex.test(event.target.value)) {
      formik.setFieldValue('nip', event.target.value)
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
      {isLoading && <LoaderPage />}
      {!isLoading && (
        <>
          <DialogTitle>
            <Typography fontWeight={'bold'} fontSize={15} textTransform={'capitalize'}>
              {type} Data User
            </Typography>
          </DialogTitle>
          <DialogContent>
            <form autoComplete='off' onSubmit={formik.handleSubmit} noValidate>
              <Grid paddingY={5} spacing={5} container>
                <Grid xs={4} item>
                  <FormControl margin={'dense'} fullWidth>
                    <CustomInputLabel id={'role'} label={'Akses'} />
                    <Select
                      label={'Akses'}
                      labelId={'role'}
                      name={'role_id'}
                      value={formik.values.role_id}
                      onChange={formik.handleChange}
                      error={formik.touched.role_id && Boolean(formik.errors.role_id)}
                      disabled={type === 'detail'}
                      inputProps={{ style: { fontSize: 11.5 } }}
                      sx={{ fontSize: 11.5 }}
                      size={'small'}
                      fullWidth
                    >
                      {role?.length ? (
                        role.map(item => (
                          <MenuItem sx={{ fontSize: 11.5 }} key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem sx={{ fontSize: 11.5 }} value={data?.role_id}>
                          {data?.role?.name}
                        </MenuItem>
                      )}
                    </Select>
                    {formik.touched.role_id && formik.errors.role_id && (
                      <ErrorMessage fontSize={11.5} message={formik.errors.role_id as string} />
                    )}
                  </FormControl>
                  <AvatarInput
                    name={'avatar'}
                    error={formik.touched.avatar && formik.errors.avatar}
                    handleChange={handleChangeAvatar}
                    disabled={type === 'detail'}
                    errorMessage={formik.errors.avatar as string}
                    value={avatar}
                  />
                </Grid>
                <Grid xs={8} item>
                  <FormControl margin={'dense'} fullWidth>
                    <CustomInputLabel id={'department'} label={'Bagian'} />
                    <Select
                      label={'Bagian'}
                      labelId={'department'}
                      name={'department_id'}
                      disabled={type === 'detail'}
                      value={formik.values.department_id}
                      onChange={formik.handleChange}
                      error={formik.touched.department_id && Boolean(formik.errors.department_id)}
                      inputProps={{ style: { fontSize: 11.5 } }}
                      sx={{ fontSize: 11.5 }}
                      size={'small'}
                      fullWidth
                    >
                      {department?.length ? (
                        department.map(item => (
                          <MenuItem sx={{ fontSize: 11.5 }} key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem sx={{ fontSize: 11.5 }} value={data?.department_id}>
                          {data?.department?.name}
                        </MenuItem>
                      )}
                    </Select>
                    {formik.touched.department_id && formik.errors.department_id && (
                      <ErrorMessage fontSize={11.5} message={formik.errors.department_id as string} />
                    )}
                  </FormControl>
                  <FormControl margin={'dense'} fullWidth>
                    <CustomInputLabel id={'prodi'} label={'Prodi'} />
                    <Select
                      label={'Prodi'}
                      labelId={'prodi'}
                      name={'kode_prodi'}
                      disabled={type === 'detail'}
                      value={formik.values.kode_prodi}
                      onChange={formik.handleChange}
                      error={formik.touched.kode_prodi && Boolean(formik.errors.kode_prodi)}
                      inputProps={{ style: { fontSize: 11.5 } }}
                      sx={{ fontSize: 11.5 }}
                      size={'small'}
                      fullWidth
                    >
                      {prodi?.length ? (
                        prodi.map(item => (
                          <MenuItem sx={{ fontSize: 11.5 }} key={item.kode_prodi} value={item.kode_prodi}>
                            {item.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem sx={{ fontSize: 11.5 }} value={data?.kode_prodi}>
                          {data?.prodi?.name}
                        </MenuItem>
                      )}
                    </Select>
                    {formik.touched.kode_prodi && formik.errors.kode_prodi && (
                      <ErrorMessage fontSize={11.5} message={formik.errors.kode_prodi as string} />
                    )}
                  </FormControl>
                  <FormControl margin={'dense'} fullWidth>
                    <CustomInputLabel id={'name'} label={'Nama Lengkap'} />
                    <OutlinedInput
                      label={'Nama Lengkap'}
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      id={'name'}
                      name={'name'}
                      inputProps={{ style: { fontSize: 11.5 } }}
                      sx={{ fontSize: 11.5 }}
                      size={'small'}
                      disabled={type === 'detail'}
                      fullWidth
                    />
                    {formik.touched.name && formik.errors.name && (
                      <ErrorMessage fontSize={11.5} message={formik.errors.name as string} />
                    )}
                  </FormControl>
                  <FormControl margin={'dense'} fullWidth>
                    <CustomInputLabel id={'nip'} label={'Nomer Induk Pegawai (NIP)'} />
                    <OutlinedInput
                      label={'Nomer Induk Pegawai (NIP)'}
                      value={formik.values.nip}
                      onChange={handleChangeNip}
                      error={formik.touched.nip && Boolean(formik.errors.nip)}
                      id={'nip'}
                      name={'nip'}
                      inputProps={{ style: { fontSize: 11.5 } }}
                      sx={{ fontSize: 11.5 }}
                      disabled={type === 'detail'}
                      size={'small'}
                      fullWidth
                    />
                    {formik.touched.nip && formik.errors.nip && (
                      <ErrorMessage fontSize={11.5} message={formik.errors.nip as string} />
                    )}
                  </FormControl>
                  <FormControl margin={'dense'} fullWidth>
                    <CustomInputLabel id={'email'} label={'Email'} />
                    <OutlinedInput
                      label={'Email'}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      id={'email'}
                      name={'email'}
                      inputProps={{ style: { fontSize: 11.5 } }}
                      sx={{ fontSize: 11.5 }}
                      disabled={type === 'detail'}
                      size={'small'}
                      fullWidth
                    />
                    {formik.touched.email && formik.errors.email && (
                      <ErrorMessage fontSize={11.5} message={formik.errors.email as string} />
                    )}
                  </FormControl>
                  {type !== 'detail' && (
                    <FormControl margin={'dense'} fullWidth>
                      <CustomInputLabel id={'password'} label={'Password'} />
                      <OutlinedInput
                        label={'Password'}
                        id={'password'}
                        name={'password'}
                        type={showPassword ? 'text' : 'password'}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        inputProps={{ style: { fontSize: 11.5 } }}
                        sx={{ fontSize: 11.5 }}
                        size={'small'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onClick={() => setShowPassword(!showPassword)}
                              onMouseDown={event => event.preventDefault()}
                              aria-label='toggle password visibility'
                            >
                              {showPassword ? <EyeOutline sx={{ fontSize: 18 }} /> : <EyeOffOutline sx={{ fontSize: 18 }} />}
                            </IconButton>
                          </InputAdornment>
                        }
                        fullWidth
                      />
                      {formik.touched.password && formik.errors.password && (
                        <ErrorMessage fontSize={11.5} message={formik.errors.password as string} />
                      )}
                    </FormControl>
                  )}
                  {type === 'tambah' && (
                    <FormControl margin={'dense'} fullWidth>
                      <CustomInputLabel id={'confirmation_password'} label={'Konfirmasi Password'} />
                      <OutlinedInput
                        label={'Konfirmasi Password'}
                        id={'confirmation_password'}
                        name={'confirmation_password'}
                        type={showPassword ? 'text' : 'password'}
                        value={formik.values.confirmation_password}
                        onChange={formik.handleChange}
                        error={formik.touched.confirmation_password && Boolean(formik.errors.confirmation_password)}
                        inputProps={{ style: { fontSize: 11.5 } }}
                        sx={{ fontSize: 11.5 }}
                        size={'small'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onClick={() => setShowPassword(!showPassword)}
                              onMouseDown={event => event.preventDefault()}
                              aria-label='toggle password visibility'
                            >
                              {showPassword ? <EyeOutline sx={{ fontSize: 18 }} /> : <EyeOffOutline sx={{ fontSize: 18 }} />}
                            </IconButton>
                          </InputAdornment>
                        }
                        fullWidth
                      />
                      {formik.touched.confirmation_password && formik.errors.confirmation_password && (
                        <ErrorMessage fontSize={11.5} message={formik.errors.confirmation_password as string} />
                      )}
                    </FormControl>
                  )}
                </Grid>
              </Grid>
              <Box textAlign={'right'}>
                {type !== 'detail' && (
                  <Button type={'submit'} color={'primary'} size={'small'} sx={{ fontSize: 12 }}>
                    Simpan
                  </Button>
                )}
                <Button
                  type={'button'}
                  onClick={() => handleClose(false)}
                  color={'secondary'}
                  size={'small'}
                  sx={{ fontSize: 12 }}
                >
                  Batal
                </Button>
              </Box>
            </form>
          </DialogContent>
        </>
      )}
    </Dialog>
  )
}
