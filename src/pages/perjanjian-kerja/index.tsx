import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { CloudDownload, CloudUpload, MicrosoftExcel, ReceiptTextCheck } from 'mdi-material-ui'
import { OutlinedInput, Select, useTheme } from '@mui/material'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import LoaderPage from '../../views/loader'
import { apiGet } from '../../util/api-fetch'
import { ReverseVerificationStatus, VerificationStatus, VerificationStatusColor } from '../../configs/enum'
import CustomTable, { Column } from '../../views/tables/CustomTable'
import PerjanjianKerjaModal from '../../@core/components/perjanjian-kerja/modal'
import { currencyFormatter } from '../../util/functions'
import IconButton from '@mui/material/IconButton'
import DraftPerjanjianKerja from '../../@core/components/perjanjian-kerja/draft'
import VerificationPerjanjianKerja from '../../@core/components/perjanjian-kerja/verification'
import { AbilityContext } from '../../@core/layouts/components/acl/Can'
import useMediaQuery from '@mui/material/useMediaQuery'
import { toast } from 'react-toastify'
import DetailPerjanjianKerja from '../../@core/components/perjanjian-kerja/detail'

const PerjanjianKerjaPage = () => {
  // state
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false)
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [showUpload, setShowUpload] = useState<boolean>(false)
  const [showDraft, setShowDraft] = useState<boolean>(false)
  const [showVerification, setShowVerification] = useState<boolean>(false)
  const [reFetchDT, setReFetchDT] = useState<boolean>(false)
  const [initializedDT, setInitializedDT] = useState<boolean>(false)
  const [filterDT, setFilterDT] = useState({ rkt_tahun: '', rkt_anggaran: '', rkt_name: '', status: '' })
  const [queryParams, setQueryParams] = useState<Record<string, any>>({ sort_field: 'id', sort_dir: 'ASC', join: 'rkt' })
  const [anggaranFilter, setAnggaranFilter] = useState<Array<string>>([])
  const [yearFilter, setYearFilter] = useState<Array<string>>([])
  const [id, setId] = useState<number>(0)

  useEffect(() => {
    apiGet('/perjanjian-kerja/filter').then(res => {
      setYearFilter(res?.data?.tahun)
      setAnggaranFilter(res?.data?.anggaran)

      setIsLoading(false)
    })
  }, [])

  useMemo(() => {
    setQueryParams({ ...queryParams, ...filterDT })
    setReFetchDT(true)
  }, [filterDT])

  // HTML ref
  const nameRef = useRef<HTMLInputElement>()

  const theme = useTheme()
  const ability = useContext(AbilityContext)
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'))

  // handler
  const handleUploadClick = (pk: Record<string, any>) => {
    setShowUpload(true)
    setId(pk.id)
  }
  const handleVerificationClick = (pk: Record<string, any>) => {
    setShowVerification(true)
    setId(pk.id)
  }
  const handleDraftClick = (pk: Record<string, any>) => {
    setId(pk.rkt_id)
    setShowDraft(true)
  }
  const handleDownloadClick = async () => {
    setDownloadLoading(true)
    try {
      const download = await apiGet('/perjanjian-kerja/download', filterDT, { responseType: 'blob' })
      const href = URL.createObjectURL(download)

      const link = document.createElement('a')
      link.href = href
      link.setAttribute('download', 'Data Perjanjian Kerja.xlsx') //or any other extension
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      URL.revokeObjectURL(href)
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Internal Server Error')
    } finally {
      setDownloadLoading(false)
    }
  }
  const handleDetailClick = (id: number) => {
    setShowDetail(true)
    setId(id)
  }

  const column: Array<Column> = [
    {
      id: 'rkt.name',
      label: 'id',
      labelFromDataField: 'id',
      minWidth: 120,
      noWrap: true,
      maxWidth: 200,
      fontSize: isMobile ? 11 : 11.5
    },
    {
      id: 'rkt.usulan_anggaran',
      label: 'Usulan Anggaran',
      align: 'center',
      transform: value => (value as number).toLocaleString(undefined, { maximumFractionDigits: 0 }).replace(/,/g, '.'),
      minWidth: 150,
      fontSize: isMobile ? 11 : 11.5
    },
    {
      id: 'rkt.tahun',
      label: 'Tahun Pengajuan',
      align: 'center',
      fontSize: isMobile ? 11 : 11.5,
      minWidth: 100
    },
    {
      id: 'status',
      label: 'Status',
      transform: value => {
        let status = ReverseVerificationStatus[value as string] || '-'
        if (value === '0') status += ' Koordinator'

        return status
      },
      isBadge: true,
      badgeColor: value => VerificationStatusColor[value as string],
      badgeOnClick: data => {
        if (data.status === '4') handleDetailClick(data.id)
      },
      fontSize: 11,
      minWidth: 200
    },
    { id: 'action', label: 'Aksi', minWidth: 120, fontSize: isMobile ? 11 : 11.5 }
  ]

  let idleTimer: NodeJS.Timeout

  return (
    <>
      {isLoading && <LoaderPage />}
      {!isLoading && (
        <Box>
          <Typography variant={'h6'} fontWeight={'bold'} color={'primary'}>
            Daftar Perjanjian Kerja
          </Typography>
          <Typography variant={'body2'}>Daftar Perjanjian Kerja Berdasarkan RKT yang Disetujui</Typography>
          <Grid rowSpacing={2} justifyContent={'space-between'} mt={10} container>
            <Grid item>
              <Grid spacing={3} container>
                <Grid item>
                  <OutlinedInput
                    placeholder={'Nama RKT...'}
                    size={'small'}
                    sx={{ backgroundColor: 'white', fontSize: isMobile ? 10 : 11, minWidth: 250 }}
                    onKeyUp={() => {
                      if (idleTimer) clearTimeout(idleTimer)

                      idleTimer = setTimeout(() => {
                        setFilterDT({ ...filterDT, rkt_name: nameRef.current?.value || '' })
                      }, 500)
                    }}
                    inputRef={nameRef}
                  />
                </Grid>
                <Grid item>
                  <Select
                    value={filterDT.rkt_tahun || '0'}
                    size={'small'}
                    sx={{ backgroundColor: 'white', fontSize: isMobile ? 10 : 11, maxWidth: 170 }}
                    onChange={event => {
                      const value = event.target.value
                      if (value !== '0') setFilterDT({ ...filterDT, rkt_tahun: value })
                      else setFilterDT({ ...filterDT, rkt_tahun: '' })
                    }}
                  >
                    <MenuItem value='0' sx={{ fontSize: 12, [theme.breakpoints.only('xs')]: { fontSize: 11, minHeight: 0 } }}>
                      Tahun RKT
                    </MenuItem>
                    {yearFilter.map(item => (
                      <MenuItem
                        key={item}
                        value={item}
                        sx={{ fontSize: 12, [theme.breakpoints.only('xs')]: { fontSize: 11, minHeight: 0 } }}
                      >
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item>
                  <Select
                    value={filterDT.rkt_anggaran || '0'}
                    size={'small'}
                    sx={{ backgroundColor: 'white', fontSize: isMobile ? 10 : 11, maxWidth: 170 }}
                    onChange={event => {
                      const value = event.target.value
                      if (value !== '0') setFilterDT({ ...filterDT, rkt_anggaran: value })
                      else setFilterDT({ ...filterDT, rkt_anggaran: '' })
                    }}
                  >
                    <MenuItem value='0' sx={{ fontSize: 12, [theme.breakpoints.only('xs')]: { fontSize: 11, minHeight: 0 } }}>
                      Usulan Anggaran
                    </MenuItem>
                    {anggaranFilter?.map(item => (
                      <MenuItem
                        key={item}
                        value={item}
                        sx={{ fontSize: 12, [theme.breakpoints.only('xs')]: { fontSize: 11, minHeight: 0 } }}
                      >
                        {currencyFormatter.format(Number(item))}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item>
                  <Select
                    value={filterDT.status || '0'}
                    size={'small'}
                    sx={{ backgroundColor: 'white', fontSize: isMobile ? 10 : 11, maxWidth: 170 }}
                    onChange={event => {
                      const value = event.target.value
                      if (value !== '0') setFilterDT({ ...filterDT, status: value })
                      else setFilterDT({ ...filterDT, status: '' })
                    }}
                  >
                    <MenuItem value='0' sx={{ fontSize: 12, [theme.breakpoints.only('xs')]: { fontSize: 11, minHeight: 0 } }}>
                      Status
                    </MenuItem>
                    {Object.keys(VerificationStatus).map(key => {
                      if (VerificationStatus[key] !== '0') {
                        return (
                          <MenuItem
                            sx={{ fontSize: 12, [theme.breakpoints.only('xs')]: { fontSize: 11, minHeight: 0 } }}
                            key={key}
                            value={VerificationStatus[key]}
                          >
                            {key}
                          </MenuItem>
                        )
                      }
                    })}
                  </Select>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid spacing={3} justifyContent={'right'} container>
                <Grid item>
                  {ability.can('download', 'perjanjian-kerja') && (
                    <Button
                      sx={{
                        backgroundImage: `linear-gradient(98deg, ${theme.palette.customColors.successGradient}, ${theme.palette.success.main} 150%)`,
                        justifyContent: 'space-between',
                        verticalAlign: 'center',
                        alignItems: 'center',
                        boxShadow: 4,
                        height: 35
                      }}
                      disabled={downloadLoading}
                      onClick={handleDownloadClick}
                      size={'small'}
                    >
                      <Grid alignItems={'center'} container>
                        <Grid mt={1.2} item>
                          <MicrosoftExcel sx={{ color: 'white' }} fontSize={'small'} />
                        </Grid>
                        <Grid item ml={2}>
                          <Typography color={'white'} fontSize={isMobile ? 10 : 11} fontWeight={'bold'}>
                            {downloadLoading ? 'Downloading...' : 'Download Excel'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box mt={3}>
            <CustomTable
              columns={column}
              url={'perjanjian-kerja'}
              initialized={initializedDT}
              reFetch={reFetchDT}
              setReFetch={setReFetchDT}
              setInitialized={setInitializedDT}
              queryParams={queryParams}
              customIcon={data => (
                <Grid container>
                  <Grid item>
                    {(ability.can('create', 'perjanjian-kerja') || ability.can('update', 'perjanjian-kerja')) &&
                      ['2', '5'].includes(data.status) && (
                        <IconButton title={'Download Draft'} onClick={() => handleDraftClick(data)}>
                          <CloudDownload />
                        </IconButton>
                      )}
                  </Grid>
                  <Grid item>
                    {(ability.can('create', 'perjanjian-kerja') || ability.can('update', 'perjanjian-kerja')) &&
                      ['2', '5'].includes(data.status) && (
                        <IconButton title={'Upload Perjanjian Kerja'} onClick={() => handleUploadClick(data)}>
                          <CloudUpload />
                        </IconButton>
                      )}
                  </Grid>
                  <Grid item>
                    {ability.can('approve', 'perjanjian-kerja') && data.status === '0' && (
                      <IconButton title={'Verifikasi'} onClick={() => handleVerificationClick(data)}>
                        <ReceiptTextCheck />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              )}
              paginationFontSize={11.5}
            />
          </Box>
          {showUpload && (
            <PerjanjianKerjaModal
              type={'ubah'}
              handleClose={hasData => {
                setShowUpload(false)
                if (hasData) setReFetchDT(true)
              }}
              id={id}
            />
          )}
          {showDraft && <DraftPerjanjianKerja id={id} handleClose={setShowDraft} />}
          {showDetail && <DetailPerjanjianKerja id={id} handleClose={() => setShowDetail(false)} />}
          {showVerification && (
            <VerificationPerjanjianKerja
              id={id}
              handleClose={hasData => {
                setShowVerification(false)
                if (hasData) setReFetchDT(true)
              }}
            />
          )}
        </Box>
      )}
    </>
  )
}

PerjanjianKerjaPage.acl = {
  action: ['create', 'update', 'read', 'delete', 'approve'],
  subject: 'perjanjian-kerja'
}

export default PerjanjianKerjaPage
