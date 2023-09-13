import { CircularProgress, DialogContent } from '@mui/material'
import Typography from '@mui/material/Typography'

export default function LoaderModal() {
  return (
    <DialogContent sx={{ textAlign: 'center', padding: 10 }}>
      <CircularProgress color={'primary'} size={23} />
      <Typography fontSize={13}>Memuat...</Typography>
    </DialogContent>
  )
}
