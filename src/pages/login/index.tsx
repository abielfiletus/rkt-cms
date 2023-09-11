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
  const [loading, setLoading] = useState<boolean>(false)

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
      setLoading(true)
      auth.login(values, err => {
        formik.setErrors(err)
        setLoading(false)
      })
    }
  })

  return (
    <Grid height={navigator?.userAgent?.includes('Windows') ? '111.1vh' : 'inherit'} overflow={'none'} container>
      <Grid item xs={12} md={6} style={{ background: 'linear-gradient(90deg, #409EC9 0%, #6769D7 100%)' }}>
        <Box position={'relative'} sx={{ height: '100vh', [theme.breakpoints.down('md')]: { height: '400px' } }}>
          <Box position={'absolute'} style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} textAlign={'center'}>
            <Box
              sx={{
                [theme.breakpoints.up('sm')]: { width: '200px', height: '300px' },
                [theme.breakpoints.down('sm')]: { width: '210px', height: '250px' },
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              <img src='/images/pages/login-backdrop.png' alt={'backdrop'} width={'100%'} height={'100%'} />
            </Box>
            <Typography
              color={'white'}
              fontWeight={'bold'}
              marginTop={2}
              variant={'body2'}
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
              padding: '15px',
              '& form .MuiTypography-body2': { fontSize: 10 }
            }}
            textAlign={'center'}
            width={'100%'}
          >
            <Box
              sx={{
                marginLeft: 'auto',
                marginRight: 'auto',
                [theme.breakpoints.up('sm')]: { width: '210px', height: '73px' },
                [theme.breakpoints.down('sm')]: { width: '100px', height: '40px' }
              }}
            >
              <img src='/images/logos/logo.png' alt={'backdrop'} width={'100%'} height={'100%'} />
            </Box>
            <Typography
              variant={'h5'}
              color={'#273B98'}
              fontWeight={'bold'}
              sx={{ [theme.breakpoints.down('md')]: { fontSize: 15 }, [theme.breakpoints.down('sm')]: { fontSize: 13 } }}
            >
              Aplikasi Rancangan Anggaran Berbasis Kinerja
            </Typography>
            <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
              <Box textAlign={'left'}>
                <OutlinedInput
                  placeholder={'NIP'}
                  startAdornment={<EmailOpenOutline color={'secondary'} style={{ marginRight: '10px' }} fontSize={'small'} />}
                  style={{
                    background: '#F6F6F6',
                    borderRadius: '30px',
                    borderBottom: 'none'
                  }}
                  sx={{
                    [theme.breakpoints.up('sm')]: { marginTop: '3rem', height: '40px' },
                    [theme.breakpoints.down('md')]: { marginTop: '2rem', height: '40px' },
                    fontSize: 12
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
                  startAdornment={<LockOpen color={'secondary'} style={{ marginRight: '10px' }} fontSize={'small'} />}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                        size={'small'}
                      >
                        {values.showPassword ? <EyeOutline fontSize={'small'} /> : <EyeOffOutline fontSize={'small'} />}
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={{ height: '40px', fontSize: 12 }}
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
                  sx={{ height: '40px', fontSize: 12 }}
                  style={{
                    background: 'linear-gradient(90deg, #419CC9 0%, #6669D6 99.93%)',
                    borderRadius: '30px',
                    marginTop: '1rem',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                  type={'submit'}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? 'Loading...' : 'Masuk Aplikasi'}
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
            fontSize={11}
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
