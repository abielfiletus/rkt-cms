import { CircularProgress, Dialog, DialogContent } from '@mui/material'
import Typography from '@mui/material/Typography'

export default function FullModalLoader() {
  return (
    <Dialog open={true} maxWidth={'md'} fullWidth>
      <DialogContent sx={{ textAlign: 'center', padding: 10 }}>
        <CircularProgress color={'primary'} />
        <Typography>Memuat...</Typography>
      </DialogContent>
    </Dialog>
  )
}
