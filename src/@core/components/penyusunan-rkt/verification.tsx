import { Dialog, DialogContent, DialogTitle, useTheme } from '@mui/material'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { currencyFormatter } from '../../../util/functions'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { Fragment, useMemo, useState } from 'react'
import Button from '@mui/material/Button'
import VerificationModal from './verification-modal'
import LoaderModal from '../modal/loader'
import { apiGet } from '../../../util/api-fetch'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import dayjs from 'dayjs'
import Divider from '@mui/material/Divider'
import { ReverseVerificationStatus, VerificationStatusColor } from '../../../configs/enum'
import IconButton from '@mui/material/IconButton'
import { Close } from 'mdi-material-ui'

interface IProps {
  data: Record<string, any>
  handleClose: (hasData: boolean) => void
}

export default function PenyusunanRKTVerification(props: IProps) {
  const { data, handleClose } = props

  const [loading, setLoading] = useState<boolean>(true)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [history, setHistory] = useState<Array<Record<string, any>>>([])
  const [type, setType] = useState<'revisi' | 'tolak' | 'setujui'>('revisi')

  const theme = useTheme()

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

  useMemo(() => {
    if (data?.id) {
      apiGet('/rkt-note-history/by-rkt/' + data.id).then(res => {
        setHistory(res?.data)
        setLoading(false)
      })
    }
  }, [data])

  return (
    <>
      {loading && <LoaderModal />}
      {!loading && (
        <Dialog
          open={true}
          maxWidth={'md'}
          onClose={(event, reason) => {
            if (reason && reason == 'backdropClick') handleClose(false)
          }}
          fullWidth
        >
          <DialogTitle>
            <Grid justifyContent={'space-between'} container>
              <Grid item>
                <Typography fontWeight={'bold'} fontSize={23} textTransform={'capitalize'}>
                  Verifikasi Penyusunan Usulan RKT
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
            <Box sx={{ fontSize: '13px !important' }}>
              <Grid container>
                <Grid md={4} fontWeight={600} item>
                  Tahun Usulan
                </Grid>
                <Grid md={8} color={theme.palette.grey['600']} item>
                  {data?.tahun}
                </Grid>
              </Grid>
              <Grid container>
                <Grid md={4} fontWeight={600} item>
                  Pengusul
                </Grid>
                <Grid md={8} color={theme.palette.grey['600']} item>
                  {data?.user_submit?.name}
                </Grid>
              </Grid>
              <Grid container>
                <Grid md={4} fontWeight={600} item>
                  Nama Usulan Kegiatan
                </Grid>
                <Grid md={8} color={theme.palette.grey['600']} item>
                  {data?.name}
                </Grid>
              </Grid>
              <Grid container>
                <Grid md={4} fontWeight={600} item>
                  Usulan Anggaran
                </Grid>
                <Grid md={8} color={theme.palette.grey['600']} item>
                  {data?.usulan_anggaran ? currencyFormatter.format(data.usulan_anggaran) : ''}
                </Grid>
              </Grid>
              <Grid container>
                <Grid md={4} fontWeight={600} item>
                  Terget Perjanjian Kerja
                </Grid>
                <Grid md={8} color={theme.palette.grey['600']} item>
                  {data?.target_perjanjian_kerja}%
                </Grid>
              </Grid>
              <Table
                sx={{
                  marginTop: 10,
                  '& .MuiTableCell-root': {
                    borderColor: theme.palette.grey['300'],
                    borderWidth: 1,
                    borderStyle: 'solid',
                    padding: '0.5rem !important',
                    fontSize: '12px !important'
                  }
                }}
              >
                <TableHead sx={{ textTransform: 'none', '& .MuiTableCell-root': { textAlign: 'center' } }}>
                  <TableRow>
                    <TableCell>Indikator Kinerja Kegiatan</TableCell>
                    <TableCell>Aksi</TableCell>
                    <TableCell>Target Perjanjian</TableCell>
                    <TableCell>Target TW 1</TableCell>
                    <TableCell>Target TW 2</TableCell>
                    <TableCell>Target TW 3</TableCell>
                    <TableCell>Target TW 4</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.rkt_x_iku?.map((rkt: Record<string, any>) => {
                    const ikuAksi = [...new Set(rkt.iku_x_aksi)] as Array<Record<string, any>>
                    const firstAksi = ikuAksi.shift()

                    return (
                      <Fragment key={rkt.id}>
                        <TableRow>
                          <TableCell rowSpan={ikuAksi.length + 1}>{rkt.iku.name}</TableCell>
                          <TableCell>{firstAksi?.rencana_aksi}</TableCell>
                          <TableCell rowSpan={ikuAksi.length + 1} sx={{ textAlign: 'center' }}>
                            {rkt.total}
                          </TableCell>
                          <TableCell rowSpan={ikuAksi.length + 1} sx={{ textAlign: 'center' }}>
                            {rkt.tw_1}
                          </TableCell>
                          <TableCell rowSpan={ikuAksi.length + 1} sx={{ textAlign: 'center' }}>
                            {rkt.tw_2}
                          </TableCell>
                          <TableCell rowSpan={ikuAksi.length + 1} sx={{ textAlign: 'center' }}>
                            {rkt.tw_3}
                          </TableCell>
                          <TableCell rowSpan={ikuAksi.length + 1} sx={{ textAlign: 'center' }}>
                            {rkt.tw_4}
                          </TableCell>
                        </TableRow>
                        {ikuAksi.map((aksi: Record<string, any>) => (
                          <TableRow key={aksi.id}>
                            <TableCell>{aksi.rencana_aksi}</TableCell>
                          </TableRow>
                        ))}
                      </Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            </Box>
            {history?.length > 0 && (
              <Box marginTop={10}>
                <Typography variant={'h6'} marginBottom={4}>
                  History Approval
                </Typography>
                <Box maxHeight={500} overflow={'auto'} padding={3}>
                  {history.map((hist, i) => (
                    <Card key={hist.id} sx={{ marginTop: i > 0 ? 4 : 0, '& .MuiCardContent-root': { padding: 3 } }}>
                      <CardContent>
                        <Typography fontSize={13} fontWeight={500}>
                          {hist.user?.name}
                        </Typography>
                        <Typography fontSize={11} color={theme.palette.grey['500']} fontStyle={'italic'}>
                          {hist.user?.role?.name} • {dayjs(hist.createdAt).format('d MMMM YYYY HH:mm')}
                        </Typography>
                        <Divider />
                        <Grid container>
                          <Grid md={2} item>
                            <Typography fontWeight={500} fontSize={13}>
                              Status
                            </Typography>
                          </Grid>
                          <Grid md={10} item>
                            {/* @ts-ignore */}
                            <Typography fontSize={13} color={theme.palette[VerificationStatusColor[hist.status]].main}>
                              {ReverseVerificationStatus[hist.status]}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid md={2} item>
                            <Typography fontWeight={500} fontSize={13}>
                              Note
                            </Typography>
                          </Grid>
                          <Grid md={10} item>
                            <Typography fontSize={13} color={theme.palette.grey['500']}>
                              {hist.note || '-'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}
            <Grid justifyContent={'right'} columnSpacing={5} marginTop={10} container>
              <Grid item>
                <Button type={'button'} color={'warning'} variant={'contained'} sx={{ paddingX: 7 }} onClick={handleRevision}>
                  <Typography color={'white'} fontSize={12} fontWeight={'bold'}>
                    Revisi
                  </Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button type={'button'} color={'error'} variant={'contained'} sx={{ paddingX: 7 }} onClick={handleReject}>
                  <Typography color={'white'} fontSize={12} fontWeight={'bold'}>
                    Tolak
                  </Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button type={'button'} color={'success'} variant={'contained'} sx={{ paddingX: 7 }} onClick={handleApprove}>
                  <Typography color={'white'} fontSize={12} fontWeight={'bold'}>
                    Setujui
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
      {showModal && <VerificationModal type={type} handleClose={handleModalClose} id={data?.id} />}
    </>
  )
}
