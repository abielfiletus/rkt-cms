// ** React Imports
import { ReactNode } from 'react'

// ** MUI Components
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Layout Import
import BlankLayout from '../@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrations from '../views/pages/FooterIllustrations'
import { useRouter } from 'next/router'

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(13)
  }
}))

const Error401 = () => {
  const router = useRouter()

  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h1'>401</Typography>
          <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
            Anda tidak memiliki izin! 🔐
          </Typography>
          <Typography variant='body2'>Anda tidak memiliki izin untuk membuka halaman ini. Silahkan hubungi Admin</Typography>
        </BoxWrapper>
        <Img height='487' alt='error-illustration' src='/images/pages/401.png' />
        <Button component='a' variant='contained' sx={{ px: 5.5 }} onClick={() => router.back()}>
          Kembali
        </Button>
      </Box>
      <FooterIllustrations />
    </Box>
  )
}

Error401.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Error401
