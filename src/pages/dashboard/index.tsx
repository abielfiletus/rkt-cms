// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from '../../@core/styles/libs/react-apexcharts'
import Paper from '@mui/material/Paper'
import LinkItem from '../../@core/components/dashboard/link-item'
import { useState } from 'react'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import EPBDashboard from '../../@core/components/dashboard/epb'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material'
import AkademikDashboard from '../../@core/components/dashboard/akademik'
import useMediaQuery from '@mui/material/useMediaQuery'

const DashboardPage = () => {
  const [activeLink, setActiveLink] = useState<'epb' | 'akademik'>('epb')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'))

  return (
    <ApexChartWrapper>
      <Paper>
        <Grid
          columnSpacing={isMobile ? 0 : 10}
          rowSpacing={3}
          justifyContent={isMobile ? 'space-between' : 'inherit'}
          padding={10}
          paddingY={5}
          sx={{ [theme.breakpoints.only('xs')]: { paddingX: 7, paddingY: 2 } }}
          container
        >
          <Grid item>
            <LinkItem
              text={'Dashboard E-PB'}
              active={activeLink === 'epb'}
              onClick={activeLink !== 'epb' ? () => setActiveLink('epb') : undefined}
            />
          </Grid>
          <Grid item>
            <LinkItem
              text={'Dashboard Akademik'}
              active={activeLink === 'akademik'}
              onClick={activeLink !== 'akademik' ? () => setActiveLink('akademik') : undefined}
            />
          </Grid>
        </Grid>
        <Divider />
        <Box paddingY={2} paddingX={5}>
          <Typography fontWeight={500} color={'black'} fontSize={20}>
            Dashboard {activeLink === 'epb' ? 'Anggaran Berbasis Kinerja' : 'Akademik'}
          </Typography>
          <Grid columnSpacing={2} mb={10} container>
            <Grid item>
              <Typography color={theme.palette.primary.main} fontSize={13} fontWeight={'bold'}>
                Grafik Data &nbsp;/
              </Typography>
            </Grid>
            <Grid item>
              <Typography fontSize={13}>{activeLink === 'epb' ? 'E-PB' : 'Akademik'}</Typography>
            </Grid>
          </Grid>
          <Box
            position={'relative'}
            sx={{
              overflowX: 'hidden',
              height: `calc(100vh - 330px)`,
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
          >
            <Box sx={{ position: 'absolute', width: '100%', left: activeLink === 'epb' ? 0 : '-1500px' }}>
              <EPBDashboard />
            </Box>
            <Box sx={{ position: 'absolute', width: '100%', right: activeLink === 'akademik' ? 0 : '-1500px' }}>
              <AkademikDashboard />
            </Box>
          </Box>
        </Box>
      </Paper>
    </ApexChartWrapper>
  )
}

DashboardPage.acl = {
  action: ['read'],
  subject: 'dashboard'
}

export default DashboardPage
