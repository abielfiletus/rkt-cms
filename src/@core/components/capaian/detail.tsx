import { Dialog, DialogActions, DialogContent, DialogTitle, useTheme } from '@mui/material'
import LoaderModal from '../modal/loader'
import { Fragment, useMemo, useState } from 'react'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import { IModalProp } from '../../../configs/modalConfig'
import { apiGet } from '../../../util/api-fetch'
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

export default function DetailCapaian(props: IModalProp) {
  const { id, handleClose } = props

  // state
  const [isLoading, setIsLoading] = useState(true)
  const [tw1Filled, setTw1Filled] = useState<boolean>(false)
  const [tw2Filled, setTw2Filled] = useState<boolean>(false)
  const [tw3Filled, setTw3Filled] = useState<boolean>(false)
  const [tw4Filled, setTw4Filled] = useState<boolean>(false)
  const [totalTw, setTotalTw] = useState<Array<any>>([])
  const [tableData, setTableData] = useState<Array<JSX.Element>>([])

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'))

  const CapaianCell = (total: Array<string>, data: Record<string, any>) => {
    return total.map(tw_index => (
      <Fragment key={tw_index}>
        <TableCell rowSpan={data.row_span} sx={{ fontSize: isMobile ? 10 : 'inherit' }}>
          {data?.capaian?.[`capaian_${tw_index}`]}
        </TableCell>
        <TableCell rowSpan={data.row_span} valign={'top'}>
          <Typography fontSize={isMobile ? 10 : 14} fontWeight={500} marginBottom={1}>
            Progress / Kegiatan :
          </Typography>
          <Typography fontSize={isMobile ? 10 : 14}>{data?.capaian?.[`progress_${tw_index}`] || '-'}</Typography>
          <Typography fontSize={isMobile ? 10 : 14} fontWeight={500} marginBottom={1} marginTop={4}>
            Kendala :
          </Typography>
          <Typography fontSize={isMobile ? 10 : 14}>{data?.capaian?.[`masalah_${tw_index}`] || '-'}</Typography>
          <Typography fontSize={isMobile ? 10 : 14} fontWeight={500} marginBottom={1} marginTop={4}>
            Strategi / Tindak Lanjut
          </Typography>
          <Typography fontSize={isMobile ? 10 : 14}>{data?.capaian?.[`strategi_${tw_index}`] || '-'}</Typography>
        </TableCell>
      </Fragment>
    ))
  }

  useMemo(() => {
    if (id) {
      apiGet('/capaian/detail-by-rkt/' + id).then(res => {
        setIsLoading(false)

        let table: Array<JSX.Element> = []
        let total: Array<string> = []
        const firstCapaian = res.data?.rkt_x_iku?.[0]?.capaian
        if (firstCapaian?.capaian_1) {
          setTw1Filled(true)
          total = ['1']
        }
        if (firstCapaian?.capaian_2) {
          setTw2Filled(true)
          total = ['1', '2']
        }
        if (firstCapaian?.capaian_3) {
          setTw3Filled(true)
          total = ['1', '2', '3']
        }
        if (firstCapaian?.capaian_4) {
          setTw4Filled(true)
          total = ['1', '2', '3', '4']
        }

        res?.data?.rkt_x_iku?.forEach((item: Record<string, any>) => {
          item.row_span = item.iku_x_aksi.length
        })

        if (res?.data) {
          const firstAksi: Array<JSX.Element> = []
          let rowspanRkt = 0

          res.data.rkt_x_iku.map((item: Record<string, any>, i: number) => {
            let rowspanIku = 0
            const aksiTable: Array<JSX.Element> = []

            item.iku_x_aksi.map((aksi: Record<string, any>, j: number) => {
              if (j > 0) {
                aksiTable.push(
                  <TableRow>
                    <TableCell sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 } }}>{aksi.rencana_aksi}</TableCell>
                  </TableRow>
                )
              }
              rowspanIku++
              rowspanRkt++
            })

            if (i > 0) {
              table.push(
                <TableRow>
                  <TableCell sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 } }} rowSpan={rowspanIku}>
                    {item?.iku?.name}
                  </TableCell>
                  <TableCell sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 } }}>
                    {item?.iku_x_aksi?.[0]?.rencana_aksi}
                  </TableCell>
                  <TableCell sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 } }} rowSpan={rowspanIku}>
                    {res.data.target_perjanjian_kerja}
                  </TableCell>
                  {CapaianCell(total, item)}
                </TableRow>,
                ...aksiTable
              )
            } else {
              firstAksi.push(...aksiTable)
            }
          })

          const firstIku = res.data.rkt_x_iku[0]
          const rowspanFirst = firstIku.iku_x_aksi.length
          table = [
            <TableRow key={'rkt-table'}>
              <TableCell sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 } }} rowSpan={rowspanRkt}>
                {res.data.id}
              </TableCell>
              <TableCell sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 } }} rowSpan={rowspanRkt}>
                {res.data.name}
              </TableCell>
              <TableCell sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 } }} rowSpan={rowspanFirst}>
                {firstIku.iku.name}
              </TableCell>
              <TableCell sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 } }}>
                {firstIku.iku_x_aksi[0].rencana_aksi}
              </TableCell>
              <TableCell sx={{ [theme.breakpoints.only('xs')]: { fontSize: 10 } }} rowSpan={rowspanFirst}>
                {res.data.target_perjanjian_kerja}
              </TableCell>
              {CapaianCell(total, firstIku)}
            </TableRow>,
            ...firstAksi,
            ...table
          ]
        }

        setTotalTw(total)
        setTableData(table)
      })
    }
  }, [id])

  return (
    <Dialog maxWidth={'md'} open={true} fullWidth>
      {isLoading && <LoaderModal />}
      {!isLoading && (
        <>
          <DialogTitle>
            <Grid justifyContent={'space-between'} container>
              <Grid xs={10} sm={'auto'} item>
                <Typography
                  fontWeight={'bold'}
                  fontSize={23}
                  sx={{ [theme.breakpoints.only('xs')]: { fontSize: 18 } }}
                  textTransform={'capitalize'}
                >
                  Pengukuran Indikator Kinerja Kegiatan
                </Typography>
              </Grid>
              <Grid xs={2} sm={'auto'} item>
                <IconButton onClick={() => handleClose(false)}>
                  <Close />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <Box justifyContent={'center'} display={'flex'}>
              <FormControlLabel
                label='Analisa Capaian TW 1'
                control={<Checkbox name='form-layouts-alignment-checkbox' size={isMobile ? 'small' : 'medium'} />}
                color={theme.palette.primary.main}
                sx={{
                  '& .MuiButtonBase-root': { paddingTop: 0, paddingBottom: 0 },
                  '& .MuiCheckbox-colorPrimary': { color: `${theme.palette.primary.main} !important` },
                  '& .MuiTypography-root': {
                    color: 'black !important',
                    fontWeight: 500,
                    fontSize: 12,
                    [theme.breakpoints.only('xs')]: { fontSize: 9 }
                  }
                }}
                checked={tw1Filled}
                disabled
              />
              <FormControlLabel
                label='Analisa Capaian TW 2'
                control={<Checkbox name='form-layouts-alignment-checkbox' size={isMobile ? 'small' : 'medium'} />}
                color={theme.palette.primary.main}
                sx={{
                  '& .MuiButtonBase-root': { paddingTop: 0, paddingBottom: 0 },
                  '& .MuiCheckbox-colorPrimary': { color: `${theme.palette.primary.main} !important` },
                  '& .MuiTypography-root': {
                    color: 'black !important',
                    fontWeight: 500,
                    fontSize: 12,
                    [theme.breakpoints.only('xs')]: { fontSize: 9 }
                  }
                }}
                checked={tw2Filled}
                disabled
              />
              <FormControlLabel
                label='Analisa Capaian TW 3'
                control={<Checkbox name='form-layouts-alignment-checkbox' size={isMobile ? 'small' : 'medium'} />}
                color={theme.palette.primary.main}
                sx={{
                  '& .MuiButtonBase-root': { paddingTop: 0, paddingBottom: 0 },
                  '& .MuiCheckbox-colorPrimary': { color: `${theme.palette.primary.main} !important` },
                  '& .MuiTypography-root': {
                    color: 'black !important',
                    fontWeight: 500,
                    fontSize: 12,
                    [theme.breakpoints.only('xs')]: { fontSize: 9 }
                  }
                }}
                checked={tw3Filled}
                disabled
              />
              <FormControlLabel
                label='Analisa Capaian TW 4'
                control={<Checkbox name='form-layouts-alignment-checkbox' size={isMobile ? 'small' : 'medium'} />}
                color={theme.palette.primary.main}
                sx={{
                  '& .MuiButtonBase-root': { paddingTop: 0, paddingBottom: 0 },
                  '& .MuiCheckbox-colorPrimary': { color: `${theme.palette.primary.main} !important` },
                  '& .MuiTypography-root': {
                    color: 'black !important',
                    fontWeight: 500,
                    fontSize: 12,
                    [theme.breakpoints.only('xs')]: { fontSize: 9 }
                  }
                }}
                checked={tw4Filled}
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
                    <TableCell align={'center'} sx={{ [theme.breakpoints.only('xs')]: { fontSize: '10px !important' } }}>
                      ID
                    </TableCell>
                    <TableCell
                      align={'center'}
                      width={300}
                      sx={{ [theme.breakpoints.only('xs')]: { fontSize: '10px !important' } }}
                    >
                      Nama Kegiatan
                    </TableCell>
                    <TableCell
                      align={'center'}
                      width={500}
                      sx={{ [theme.breakpoints.only('xs')]: { fontSize: '10px !important' } }}
                    >
                      Indikator Kinerja Kegiatan
                    </TableCell>
                    <TableCell
                      align={'center'}
                      width={500}
                      sx={{ [theme.breakpoints.only('xs')]: { fontSize: '10px !important' } }}
                    >
                      Aksi
                    </TableCell>
                    <TableCell align={'center'} sx={{ [theme.breakpoints.only('xs')]: { fontSize: '10px !important' } }}>
                      Target Perjanjian
                    </TableCell>
                    {totalTw.map(item => (
                      <Fragment key={item}>
                        <TableCell align={'center'} sx={{ [theme.breakpoints.only('xs')]: { fontSize: '10px !important' } }}>
                          Target TW{item}
                        </TableCell>
                        <TableCell
                          align={'center'}
                          width={600}
                          sx={{ [theme.breakpoints.only('xs')]: { fontSize: '10px !important' } }}
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
              <Button color={'secondary'} variant={'contained'}>
                <Grid paddingTop={1} columnSpacing={2} container>
                  <Grid item>
                    <FilePdfBox fontSize={isMobile ? 'small' : 'medium'} />
                  </Grid>
                  <Grid fontSize={isMobile ? 10 : 'inherit'} item>
                    Download
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
