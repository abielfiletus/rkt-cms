import { Dialog, DialogContent } from '@mui/material'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { apiDelete } from '../../../../util/api-fetch'
import Image from 'next/image'

interface IProps {
  handleClose: (data: boolean) => void
  modalTitle: string
  title: string
  subTitle?: string
  id: string | number
  url: string
}

export default function DeleteModal(props: IProps) {
  const { handleClose, modalTitle, title, subTitle, id, url } = props

  const handleDelete = async () => {
    await apiDelete('/' + url + '/' + id)
    handleClose(true)
  }

  return (
    <Dialog
      open={true}
      onClose={(event, reason) => {
        if (reason && reason == 'backdropClick') handleClose(false)
      }}
      maxWidth={'sm'}
      fullWidth
    >
      <DialogContent sx={{ textAlign: 'center' }}>
        <Box>
          <Typography fontWeight={700}>Hapus {modalTitle}</Typography>
          <Image src={'/images/pages/delete.jpeg'} width={170} height={200} />
          <Typography variant={'body2'}>Apakah anda yakin ingin menghapus ?</Typography>
          <Typography marginTop={5} sx={{ whiteSpace: 'pre-wrap' }}>
            {title}
          </Typography>
          {subTitle && (
            <Typography variant={'body2'} sx={{ whiteSpace: 'pre-wrap' }}>
              {subTitle}
            </Typography>
          )}
        </Box>
        <Grid justifyContent={'right'} marginTop={5} container>
          <Grid item>
            <Button color={'error'} onClick={handleDelete}>
              Hapus
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={() => handleClose(false)} color={'secondary'}>
              Batal
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
