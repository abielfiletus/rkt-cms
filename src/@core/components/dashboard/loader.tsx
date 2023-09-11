import Grid from '@mui/material/Grid'
import { CircularProgress } from '@mui/material'
import Typography from '@mui/material/Typography'

export default function ChartLoader() {
  return (
    <Grid justifyContent={'center'} marginTop={3} columnSpacing={2} container>
      <Grid item>
        <CircularProgress size={12} />
      </Grid>
      <Grid item>
        <Typography pt={1} fontSize={11}>
          Memuat Data...
        </Typography>
      </Grid>
    </Grid>
  )
}
