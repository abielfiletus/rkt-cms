import LoaderModal from '../modal/loader'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useMemo, useState } from 'react'
import { apiGet } from '../../../util/api-fetch'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

interface IProps {
  id: number
  handleClose: (open: boolean) => void
}

export default function DraftPerjanjianKerja(props: IProps) {
  const { id, handleClose } = props

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingText, setIsLoadingText] = useState<boolean>(false)
  const [pdf, setPdf] = useState<string>('')
  const [rktNo, setRktNo] = useState<string>('')

  useMemo(() => {
    if (id) {
      apiGet('/perjanjian-kerja/download-draft/' + id).then(res => {
        setIsLoading(false)
        setPdf('data:application/pdf;base64,' + res.data.file)
        setRktNo(res.data.no_pengajuan)
      })
    }
  }, [id])

  const handleClickDownload = async () => {
    setIsLoadingText(true)
    const link = document.createElement('a')
    const ftch = await fetch(pdf)
    const fileBlob = await ftch.blob()

    link.href = window.URL.createObjectURL(new Blob([fileBlob]))
    link.setAttribute('download', `Perjanjian Kerja ${rktNo}.pdf`)

    document.body.appendChild(link)
    link.click()
    link.parentNode?.removeChild(link)
    setIsLoadingText(false)
  }

  return (
    <Dialog open={true} maxWidth={'md'} fullWidth>
      {isLoading && <LoaderModal />}
      {!isLoading && (
        <>
          <DialogTitle>
            <Typography fontWeight={'bold'} fontSize={23} textTransform={'capitalize'}>
              Draft Perjanjian Kerja
            </Typography>
          </DialogTitle>
          <DialogContent>
            <iframe src={pdf + '#toolbar=0'} frameBorder='1' width={'100%'} height={'600px'} />
          </DialogContent>
          <DialogActions>
            <Grid spacing={2} justifyContent={'right'} marginTop={2} container>
              <Grid item>
                <Button onClick={handleClickDownload} color={'primary'} variant={'contained'} disabled={isLoadingText}>
                  {isLoadingText && 'DOWNLOADING...'}
                  {!isLoadingText && 'DOWNLOAD'}
                </Button>
              </Grid>
              <Grid item>
                <Button type={'button'} variant={'contained'} onClick={() => handleClose(false)} color={'secondary'}>
                  BATAL
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}
