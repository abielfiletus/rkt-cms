import LoaderModal from '../modal/loader'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useMemo, useState } from 'react'
import { apiGet } from '../../../util/api-fetch'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import VerificationModal from './verification-modal'
import IconButton from '@mui/material/IconButton'
import { Close } from 'mdi-material-ui'
import { blobToBase64 } from '../../../util/functions'

interface IProps {
  id: number
  handleClose: (open: boolean) => void
}

export default function VerificationPerjanjianKerja(props: IProps) {
  const { id, handleClose } = props

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [data, setData] = useState<Record<string, any>>({})
  const [showModal, setShowModal] = useState<boolean>(false)
  const [type, setType] = useState<'revisi' | 'tolak' | 'setujui'>('revisi')
  const [pdf, setPdf] = useState<string>('')

  useMemo(() => {
    if (id) {
      apiGet('/perjanjian-kerja/' + id).then(async res => {
        const getFile = await fetch(process.env.NEXT_PUBLIC_BE_URL + '/' + res.data.perjanjian_kerja)
        const blob = await getFile.blob()
        const file = (await blobToBase64(blob)) as string

        setData(res.data)
        setPdf(file)
        setIsLoading(false)
      })
    }
  }, [id])

  const handleRevision = () => {
    setShowModal(true)
    setType('revisi')
  }

  const handleApprove = () => {
    setShowModal(true)
    setType('setujui')
  }

  const handleReject = () => {
    setShowModal(true)
    setType('tolak')
  }

  const handleModalClose = (hasData: boolean) => {
    setShowModal(false)

    if (hasData) handleClose(true)
  }

  return (
    <>
      <Dialog open={true} maxWidth={'md'} fullWidth>
        {isLoading && <LoaderModal />}
        {!isLoading && (
          <>
            <DialogTitle>
              <Grid justifyContent={'space-between'} container>
                <Grid item>
                  <Typography fontWeight={'bold'} fontSize={23} textTransform={'capitalize'}>
                    Draft Perjanjian Kerja
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={() => handleClose(false)}>
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
                  <Button type={'button'} color={'warning'} variant={'contained'} sx={{ paddingX: 7 }} onClick={handleRevision}>
                    <Typography color={'white'} fontSize={12} fontWeight={'bold'}>
                      Revisi
                    </Typography>
                  </Button>
                </Grid>
                {/*<Grid item>*/}
                {/*  <Button type={'button'} color={'error'} variant={'contained'} sx={{ paddingX: 7 }} onClick={handleReject}>*/}
                {/*    <Typography color={'white'} fontSize={12} fontWeight={'bold'}>*/}
                {/*      Tolak*/}
                {/*    </Typography>*/}
                {/*  </Button>*/}
                {/*</Grid>*/}
                <Grid item>
                  <Button type={'button'} color={'success'} variant={'contained'} sx={{ paddingX: 7 }} onClick={handleApprove}>
                    <Typography color={'white'} fontSize={12} fontWeight={'bold'}>
                      Setujui
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </Dialog>
      {showModal && <VerificationModal type={type} handleClose={handleModalClose} id={data?.id} />}
    </>
  )
}
