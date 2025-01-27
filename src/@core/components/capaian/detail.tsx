import { Dialog, DialogActions, DialogContent, DialogTitle, useTheme } from '@mui/material'
import LoaderModal from '../modal/loader'
import { Fragment, useMemo, useState } from 'react'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import { IModalProp } from '../../../configs/modalConfig'
import { apiGet, apiPost } from '../../../util/api-fetch'
import Grid from '@mui/material/Grid'
import { Close, FilePdfBox } from 'mdi-material-ui'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import { toast } from 'react-toastify'

export default function DetailCapaian(props: IModalProp) {
  const { id, handleClose } = props

  // state
  const [isLoading, setIsLoading] = useState(true)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [checkedTw, setCheckedTw] = useState<Array<number>>([])
  const [tableData, setTableData] = useState<Array<JSX.Element>>([])
  const [data, setData] = useState<Record<string, any>>()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'))

  const CapaianCell = (data: Record<string, any>) => {
    return checkedTw.map(tw_index => (
      <Fragment key={tw_index}>
        <TableCell rowSpan={data.row_span} sx={{ fontSize: isMobile ? 10 : 11.5 }}>
          {data?.[`tw_${tw_index}`]}
        </TableCell>
        <TableCell rowSpan={data.row_span} sx={{ fontSize: isMobile ? 10 : 11.5 }}>
          {data?.capaian?.[`capaian_${tw_index}`]}
        </TableCell>
        <TableCell rowSpan={data.row_span} valign={'top'}>
          <Typography fontSize={isMobile ? 10 : 11.5} fontWeight={500} marginBottom={1}>
            Progress / Kegiatan :
          </Typography>
          <Typography fontSize={isMobile ? 10 : 11.5}>{data?.capaian?.[`progress_${tw_index}`] || '-'}</Typography>
          <Typography fontSize={isMobile ? 10 : 11.5} fontWeight={500} marginBottom={1} marginTop={4}>
            Kendala :
          </Typography>
          <Typography fontSize={isMobile ? 10 : 11.5}>{data?.capaian?.[`masalah_${tw_index}`] || '-'}</Typography>
          <Typography fontSize={isMobile ? 10 : 11.5} fontWeight={500} marginBottom={1} marginTop={4}>
            Strategi / Tindak Lanjut :
          </Typography>
          <Typography fontSize={isMobile ? 10 : 11.5}>{data?.capaian?.[`strategi_${tw_index}`] || '-'}</Typography>
        </TableCell>
      </Fragment>
    ))
  }

  const FetchTable = () => {
    let table: Array<JSX.Element> = []
    data?.rkt_x_iku?.forEach((item: Record<string, any>) => {
      item.row_span = item.iku_x_aksi.length
    })

    if (data) {
      const firstAksi: Array<JSX.Element> = []
      let rowspanRkt = 0

      data.rkt_x_iku.map((item: Record<string, any>, i: number) => {
        let rowspanIku = 0
        const aksiTable: Array<JSX.Element> = []

        item.iku_x_aksi.map((aksi: Record<string, any>, j: number) => {
          if (j > 0) {
            aksiTable.push(
              <TableRow>
                <TableCell sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 }, fontSize: 11.5 }}>
                  {aksi.rencana_aksi}
                </TableCell>
              </TableRow>
            )
          }
          rowspanIku++
          rowspanRkt++
        })

        if (i > 0) {
          table.push(
            <TableRow>
              <TableCell sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 }, fontSize: 11.5 }} rowSpan={rowspanIku}>
                {item?.iku?.name}
              </TableCell>
              <TableCell sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 }, fontSize: 11.5 }}>
                {item?.iku_x_aksi?.[0]?.rencana_aksi}
              </TableCell>
              <TableCell sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 }, fontSize: 11.5 }} rowSpan={rowspanIku}>
                {data.target_perjanjian_kerja}
              </TableCell>
              {CapaianCell(item)}
            </TableRow>,
            ...aksiTable
          )
        } else {
          firstAksi.push(...aksiTable)
        }
      })

      const firstIku = data.rkt_x_iku[0]
      const rowspanFirst = firstIku.iku_x_aksi.length
      table = [
        <TableRow key={'rkt-table'}>
          <TableCell sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 }, fontSize: 11.5 }} rowSpan={rowspanRkt}>
            {data.id}
          </TableCell>
          <TableCell sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 }, fontSize: 11.5 }} rowSpan={rowspanRkt}>
            {data.name}
          </TableCell>
          <TableCell sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 }, fontSize: 11.5 }} rowSpan={rowspanFirst}>
            {firstIku.iku.name}
          </TableCell>
          <TableCell sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 }, fontSize: 11.5 }}>
            {firstIku.iku_x_aksi[0].rencana_aksi}
          </TableCell>
          <TableCell sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 }, fontSize: 11.5 }} rowSpan={rowspanFirst}>
            {data.target_perjanjian_kerja}
          </TableCell>
          {CapaianCell(firstIku)}
        </TableRow>,
        ...firstAksi,
        ...table
      ]
    }

    setTableData(table)
  }

  useMemo(() => FetchTable(), [checkedTw])
  useMemo(() => FetchTable(), [data])

  useMemo(() => {
    if (id) {
      apiGet('/capaian/detail-by-rkt/' + id).then(res => {
        setIsLoading(false)
        setData(res?.data)
      })
    }
  }, [id])

  const handleTwClick = (index: number) => {
    if (checkedTw.includes(index)) {
      setCheckedTw(checkedTw.filter(val => val !== index))
    } else {
      setCheckedTw(val => [...val, index].sort())
    }
  }

  const handleDownload = async () => {
    if (data) {
      setDownloadLoading(true)
      try {
        const res = await apiPost(
          '/capaian/download-pdf',
          { rkt_id: data.id, tw_checked: checkedTw.map(index => '' + index) },
          {},
          true,
          false
        )

        if (res.data) {
          const link = document.createElement('a')
          link.href = 'data:application/pdf;base64,' + res.data?.file
          link.setAttribute('download', res.data?.recommendation_filename)

          document.body.appendChild(link)
          link.click()
          link.parentNode?.removeChild(link)
        } else {
          throw 'Download error'
        }
      } catch (err) {
        toast.error('Gagal mendownload file')
      } finally {
        setDownloadLoading(false)
      }
    }
  }

  return (
    <Dialog maxWidth={'md'} open={true} fullWidth>
      {isLoading && <LoaderModal />}
      {!isLoading && (
        <>
          <DialogTitle>
            <Grid justifyContent={'space-between'} container>
              <Grid xs={10} sm={'auto'} item>
                <Typography fontWeight={'bold'} fontSize={15} textTransform={'capitalize'}>
                  Pengukuran Indikator Kinerja Kegiatan
                </Typography>
              </Grid>
              <Grid xs={2} sm={'auto'} item>
                <IconButton onClick={() => handleClose(false)}>
                  <Close sx={{ fontSize: 15 }} />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <Box justifyContent={'center'} display={'flex'}>
              <FormControlLabel
                label='Analisa Capaian TW 1'
                control={<Checkbox name='form-layouts-alignment-checkbox' size={'small'} />}
                color={theme.palette.primary.main}
                sx={{
                  '& .MuiButtonBase-root': { paddingTop: 0, paddingBottom: 0 },
                  '& .MuiCheckbox-colorPrimary': { color: `${theme.palette.primary.main} !important` },
                  '& .MuiTypography-root': {
                    color: 'black !important',
                    fontWeight: 500,
                    fontSize: 11.5,
                    [theme.breakpoints.only('xs')]: { fontSize: 9 }
                  }
                }}
                checked={checkedTw.includes(1)}
                onClick={() => handleTwClick(1)}
                disabled
              />
              <FormControlLabel
                label='Analisa Capaian TW 2'
                control={<Checkbox name='form-layouts-alignment-checkbox' size={'small'} />}
                color={theme.palette.primary.main}
                sx={{
                  '& .MuiButtonBase-root': { paddingTop: 0, paddingBottom: 0 },
                  '& .MuiCheckbox-colorPrimary': { color: `${theme.palette.primary.main} !important` },
                  '& .MuiTypography-root': {
                    color: 'black !important',
                    fontWeight: 500,
                    fontSize: 11.5,
                    [theme.breakpoints.only('xs')]: { fontSize: 9 }
                  }
                }}
                checked={checkedTw.includes(2)}
                onClick={() => handleTwClick(2)}
                disabled
              />
              <FormControlLabel
                label='Analisa Capaian TW 3'
                control={<Checkbox name='form-layouts-alignment-checkbox' size={'small'} />}
                color={theme.palette.primary.main}
                sx={{
                  '& .MuiButtonBase-root': { paddingTop: 0, paddingBottom: 0 },
                  '& .MuiCheckbox-colorPrimary': { color: `${theme.palette.primary.main} !important` },
                  '& .MuiTypography-root': {
                    color: 'black !important',
                    fontWeight: 500,
                    fontSize: 11.5,
                    [theme.breakpoints.only('xs')]: { fontSize: 9 }
                  }
                }}
                checked={checkedTw.includes(3)}
                onClick={() => handleTwClick(3)}
                disabled
              />
              <FormControlLabel
                label='Analisa Capaian TW 4'
                control={<Checkbox name='form-layouts-alignment-checkbox' size={'small'} />}
                color={theme.palette.primary.main}
                sx={{
                  '& .MuiButtonBase-root': { paddingTop: 0, paddingBottom: 0 },
                  '& .MuiCheckbox-colorPrimary': { color: `${theme.palette.primary.main} !important` },
                  '& .MuiTypography-root': {
                    color: 'black !important',
                    fontWeight: 500,
                    fontSize: 11.5,
                    [theme.breakpoints.only('xs')]: { fontSize: 9 }
                  }
                }}
                checked={checkedTw.includes(4)}
                onClick={() => handleTwClick(4)}
                disabled
              />
            </Box>
            <TableContainer sx={{ maxHeight: 550, marginTop: 5 }}>
              <Table
                sx={{
                  '& td': {
                    border: '0.5px solid rgba(58, 53, 65, 0.12)',
                    padding: '7px !important',
                    letterSpacing: '0 !important',
                    lineHeight: 'inherit'
                  },
                  '& th': {
                    border: '0.5px solid rgba(58, 53, 65, 0.12)',
                    padding: '7px !important',
                    letterSpacing: '0 !important',
                    lineHeight: 'inherit'
                  },
                  minWidth: 2300
                }}
                stickyHeader
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      align={'center'}
                      sx={{ [theme.breakpoints.only('xs')]: { fontSize: '10px !important' }, fontSize: '11.5px !important' }}
                    >
                      ID
                    </TableCell>
                    <TableCell
                      align={'center'}
                      width={300}
                      sx={{ [theme.breakpoints.only('xs')]: { fontSize: '10px !important' }, fontSize: '11.5px !important' }}
                    >
                      Nama Kegiatan
                    </TableCell>
                    <TableCell
                      align={'center'}
                      width={500}
                      sx={{ [theme.breakpoints.only('xs')]: { fontSize: '10px !important' }, fontSize: '11.5px !important' }}
                    >
                      Indikator Kinerja Kegiatan
                    </TableCell>
                    <TableCell
                      align={'center'}
                      width={500}
                      sx={{ [theme.breakpoints.only('xs')]: { fontSize: '10px !important' }, fontSize: '11.5px !important' }}
                    >
                      Aksi
                    </TableCell>
                    <TableCell
                      align={'center'}
                      sx={{ [theme.breakpoints.only('xs')]: { fontSize: '10px !important' }, fontSize: '11.5px !important' }}
                    >
                      Target Perjanjian
                    </TableCell>
                    {checkedTw.map(item => (
                      <Fragment key={item}>
                        <TableCell
                          align={'center'}
                          sx={{
                            [theme.breakpoints.only('xs')]: { fontSize: '10px !important' },
                            fontSize: '11.5px !important'
                          }}
                        >
                          Target Diajukan TW{item}
                        </TableCell>
                        <TableCell
                          align={'center'}
                          sx={{
                            [theme.breakpoints.only('xs')]: { fontSize: '10px !important' },
                            fontSize: '11.5px !important'
                          }}
                        >
                          Capaian Target TW{item}
                        </TableCell>
                        <TableCell
                          align={'center'}
                          width={600}
                          sx={{
                            [theme.breakpoints.only('xs')]: { fontSize: '10px !important' },
                            fontSize: '11.5px !important'
                          }}
                        >
                          Analisa Progress Capaian TW{item}
                        </TableCell>
                      </Fragment>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>{tableData}</TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Box marginTop={5}>
              <Button
                color={'secondary'}
                variant={'contained'}
                onClick={handleDownload}
                disabled={downloadLoading}
                sx={{ textTransform: 'none' }}
                size={'small'}
              >
                <Grid paddingTop={1} columnSpacing={2} container>
                  <Grid item>
                    <FilePdfBox fontSize={'small'} />
                  </Grid>
                  <Grid fontSize={isMobile ? 10 : 12} item>
                    {downloadLoading ? 'Downloading...' : 'Download'}
                  </Grid>
                </Grid>
              </Button>
            </Box>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}
