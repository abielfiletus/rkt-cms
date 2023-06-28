// ** React Imports
import { MouseEvent, ReactNode, useEffect, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

import BlankLayout from '../../@core/layouts/BlankLayout'
import Grid from '@mui/material/Grid'
import { EmailOpenOutline, LockOpen } from 'mdi-material-ui'
import { useTheme } from '@mui/material'
import { useFormik } from 'formik'
import { LoginSchema } from '../../@core/components/login/login.schema'
import ErrorMessage from '../../@core/components/error-message'
import { useAuth } from '../../@core/hooks/useAuth'

interface State {
  password: string
  nip: string
  showPassword: boolean
}

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState<State>({
    password: '',
    nip: '',
    showPassword: false
  })

  const theme = useTheme()
  const router = useRouter()
  const auth = useAuth()

  useEffect(() => {
    if (auth.user?.id && auth.acl?.length) {
      router.replace(auth.acl[0].subject as string)
    }
  }, [])

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const formik = useFormik({
    initialValues: {
      nip: '',
      password: ''
    },
    validationSchema: LoginSchema,
    onSubmit: async values => {
      auth.login(values, err => {
        formik.setErrors(err)
      })
      // const fetch = await apiPost('/user/login', values)
      //
      // if (fetch.code === 422) {
      //   formik.setErrors(fetch.error)
      // } else {
      //   window.localStorage.setItem('access', fetch.data.token)
      //   window.localStorage.setItem('name', fetch.data.name)
      //   window.localStorage.setItem('nip', fetch.data.nip)
      //   window.localStorage.setItem('id', fetch.data.id)
      //   window.localStorage.setItem('email', fetch.data.email)
      //   window.localStorage.setItem('prodi', JSON.stringify(fetch.data.prodi))
      //   window.localStorage.setItem('role', JSON.stringify(fetch.data.role))
      //   window.localStorage.setItem('department', JSON.stringify(fetch.data.department))
      //   window.localStorage.setItem('avatar', process.env.NEXT_PUBLIC_BE_URL + '/' + fetch.data.avatar)
      //
      //   auth.setUser(fetch.data)
      //
      //   const permissions = await apiGet(authConfig.permissionsEndpoint)
      //   auth.setAcl(permissions?.data)
      //   console.log(permissions?.data)
      //
      //   let redirectURL = '/'
      //
      //   if (permissions?.data?.length) redirectURL = permissions?.data[0].subject
      //   if (returnUrl && returnUrl !== '/') redirectURL = returnUrl as string
      //
      //   toast.success('Berhasil Masuk')
      //
      //   await router.replace(redirectURL as string)
      // }
    }
  })

  return (
    <Grid container>
      <Grid item xs={12} md={6} style={{ background: 'linear-gradient(90deg, #409EC9 0%, #6769D7 100%)' }}>
        <Box position={'relative'} sx={{ height: '100vh', [theme.breakpoints.down('md')]: { height: '400px' } }}>
          <Box position={'absolute'} style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} textAlign={'center'}>
            <Box
              sx={{
                [theme.breakpoints.up('md')]: { width: '280px', height: '370px', marginLeft: 0 },
                [theme.breakpoints.up('sm')]: { width: '200px', height: '300px', marginLeft: '2rem' },
                [theme.breakpoints.down('sm')]: { width: '210px', height: '250px', marginLeft: 'auto', marginRight: 'auto' }
              }}
            >
              <img src='/images/pages/login-backdrop.png' alt={'backdrop'} width={'100%'} height={'100%'} />
            </Box>
            <Typography
              color={'white'}
              fontWeight={'bold'}
              marginTop={2}
              sx={{ [theme.breakpoints.down('sm')]: { fontSize: 13 } }}
            >
              Performance Based Budgeting
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box position={'relative'} sx={{ height: '100vh', [theme.breakpoints.down('md')]: { height: '400px' } }}>
          <Box
            position={'absolute'}
            sx={{
              [theme.breakpoints.up('sm')]: { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' },
              padding: '15px'
            }}
            textAlign={'center'}
            width={'100%'}
          >
            <Box
              sx={{
                marginLeft: 'auto',
                marginRight: 'auto',
                [theme.breakpoints.up('md')]: { width: '300px', height: '100px' },
                [theme.breakpoints.up('sm')]: { width: '210px', height: '80px' },
                [theme.breakpoints.down('sm')]: { width: '100px', height: '40px' }
              }}
            >
              <img src='/images/logos/logo.png' alt={'backdrop'} width={'100%'} height={'100%'} />
            </Box>
            <Typography
              variant={'h5'}
              color={'#273B98'}
              fontWeight={'bold'}
              sx={{ [theme.breakpoints.down('md')]: { fontSize: 17 }, [theme.breakpoints.down('sm')]: { fontSize: 13 } }}
            >
              Aplikasi Rancangan Anggaran Berbasis Kinerja
            </Typography>
            <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
              <Box textAlign={'left'}>
                <OutlinedInput
                  placeholder={'NIP'}
                  startAdornment={<EmailOpenOutline color={'secondary'} style={{ marginRight: '10px' }} />}
                  style={{
                    background: '#F6F6F6',
                    borderRadius: '30px',
                    borderBottom: 'none'
                  }}
                  sx={{
                    [theme.breakpoints.up('sm')]: { marginTop: '3rem', height: '60px' },
                    [theme.breakpoints.down('md')]: { marginTop: '2rem', height: '45px' }
                  }}
                  id='nip'
                  name='nip'
                  value={formik.values.nip}
                  onChange={formik.handleChange}
                  error={formik.touched.nip && Boolean(formik.errors.nip)}
                  fullWidth
                  autoFocus
                />
                {formik.touched.nip && formik.errors.nip && <ErrorMessage pl={'20px'} message={formik.errors.nip} />}
              </Box>
              <Box textAlign={'left'}>
                <OutlinedInput
                  placeholder={'Password'}
                  type={values.showPassword ? 'text' : 'password'}
                  startAdornment={<LockOpen color={'secondary'} style={{ marginRight: '10px' }} />}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                      >
                        {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={{
                    [theme.breakpoints.up('sm')]: { height: '60px' },
                    [theme.breakpoints.down('md')]: { height: '45px' }
                  }}
                  style={{
                    background: '#F6F6F6',
                    borderRadius: '30px',
                    borderBottom: 'none',
                    marginTop: '1rem'
                  }}
                  id='password'
                  name='password'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  fullWidth
                />
                {formik.touched.password && formik.errors.password && (
                  <ErrorMessage pl={'20px'} message={formik.errors.password} />
                )}
              </Box>
              <Box>
                <Button
                  sx={{
                    [theme.breakpoints.up('sm')]: { height: '60px' },
                    [theme.breakpoints.down('md')]: { height: '45px' }
                  }}
                  style={{
                    background: 'linear-gradient(90deg, #419CC9 0%, #6669D6 99.93%)',
                    borderRadius: '30px',
                    marginTop: '1rem',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                  type={'submit'}
                  fullWidth
                >
                  Masuk Aplikasi
                </Button>
              </Box>
            </form>
          </Box>
          <Typography
            color={'rgba(11, 62, 128, 0.3)'}
            position={'absolute'}
            bottom={20}
            left={'50%'}
            style={{ transform: 'translateX(-50%)' }}
            variant={'body2'}
          >
            Politeknik Negeri Ambon
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
