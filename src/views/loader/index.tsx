import { ReactNode } from 'react'
import BlankLayout from '../../@core/layouts/BlankLayout'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { CircularProgress, useTheme } from '@mui/material'

const LoaderPage = () => {
  const theme = useTheme()

  return (
    <Box height={'100vh'} width={'100vw'} position={'absolute'} top={0} left={0} zIndex={2000} bgcolor={theme.palette.grey['50']}>
      <Box position={'absolute'} sx={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} textAlign={'center'}>
        <CircularProgress color={'primary'} />
        <Typography>Memuat...</Typography>
      </Box>
    </Box>
  )
}

LoaderPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoaderPage
