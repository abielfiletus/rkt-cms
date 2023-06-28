import { CircularProgress, DialogContent } from '@mui/material'
import Typography from '@mui/material/Typography'

export default function LoaderModal() {
  return (
    <DialogContent sx={{ textAlign: 'center', padding: 10 }}>
      <CircularProgress color={'primary'} />
      <Typography>Memuat...</Typography>
    </DialogContent>
  )
}
