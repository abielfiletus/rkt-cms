import LoaderModal from '../modal/loader'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useMemo, useState } from 'react'
import { apiGet } from '../../../util/api-fetch'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import { Close } from 'mdi-material-ui'
import { blobToBase64 } from '../../../util/functions'

interface IProps {
  id: number
  handleClose: () => void
}

export default function DetailPerjanjianKerja(props: IProps) {
  const { id, handleClose } = props

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [pdf, setPdf] = useState<string>('')

  useMemo(() => {
    if (id) {
      apiGet('/perjanjian-kerja/' + id).then(async res => {
        const getFile = await fetch(process.env.NEXT_PUBLIC_BE_URL + '/' + res.data.perjanjian_kerja)
        const blob = await getFile.blob()
        const file = (await blobToBase64(blob)) as string

        setPdf(file)
        setIsLoading(false)
      })
    }
  }, [id])

  return (
    <>
      <Dialog open={true} maxWidth={'md'} fullWidth>
        {isLoading && <LoaderModal />}
        {!isLoading && (
          <>
            <DialogTitle>
              <Grid justifyContent={'space-between'} container>
                <Grid item>
                  <Typography fontWeight={'bold'} fontSize={15} textTransform={'capitalize'}>
                    Detail Perjanjian Kerja
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={() => handleClose()}>
                    <Close />
                  </IconButton>
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent>
              {pdf && <iframe src={pdf + '#toolbar=0'} frameBorder='1' width={'100%'} height={'600px'} />}
            </DialogContent>
            <DialogActions>
              <Grid justifyContent={'right'} columnSpacing={5} marginTop={10} container>
                <Grid item>
                  <Button
                    type={'button'}
                    variant={'contained'}
                    sx={{ paddingX: 7, textTransform: 'none' }}
                    onClick={() => handleClose()}
                  >
                    <Typography color={'white'} fontSize={12} fontWeight={'bold'}>
                      Tutup
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  )
}
