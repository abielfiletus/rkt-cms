import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MahasiswaAktifChart from './chart/MahasiswaAktif'
import PendaftaranWisudaChart from './chart/PendaftaranWisuda'
import MahasiswaCutiChart from './chart/MahasiswaCuti'
import MahasiswaDOChart from './chart/MahasiswaDO'
import MahasiswaAktifXStatusChart from './chart/MahasiswaAktifXStatus'
import MaBaAktifXStatusChart from './chart/MaBaAktifXStatus'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material'

export default function AkademikDashboard() {
  const theme = useTheme()
  const isDesktopAndBelow = useMediaQuery(theme.breakpoints.down('lg'))

  return (
    <>
      <Grid spacing={7} paddingX={2} justifyContent={isDesktopAndBelow ? 'center' : 'space-between'} container>
        <Grid item>
          <MahasiswaAktifChart />
        </Grid>
        <Grid item>
          <PendaftaranWisudaChart />
        </Grid>
        <Grid item>
          <MahasiswaCutiChart />
        </Grid>
        <Grid item>
          <MahasiswaDOChart />
        </Grid>
      </Grid>
      <Box mt={15}>
        <MahasiswaAktifXStatusChart />
      </Box>
      <Box mt={15}>
        <MaBaAktifXStatusChart />
      </Box>
    </>
  )
}
