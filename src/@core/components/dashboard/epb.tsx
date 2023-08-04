import Box from '@mui/material/Box'
import JumlahRktChart from './chart/JumlahRkt'
import RktBasedStatusChart from './chart/RktBasedStatus'
import RktBasedCapaianChart from './chart/RktBasedCapaian'

export default function EPBDashboard() {
  return (
    <>
      <Box>
        <JumlahRktChart />
      </Box>
      <Box mt={15}>
        <RktBasedStatusChart />
      </Box>
      <Box mt={15}>
        <RktBasedCapaianChart />
      </Box>
    </>
  )
}