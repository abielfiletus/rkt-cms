// ** MUI Import
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const FallbackSpinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <img src={'/images/logos/logo.png'} width={140} height={50} alt={'logo'} />
      <CircularProgress disableShrink sx={{ mt: 3 }} size={23} />
    </Box>
  )
}

export default FallbackSpinner
