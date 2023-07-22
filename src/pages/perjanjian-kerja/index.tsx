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

const PerjanjianKerjaPage = () => {
  // state
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [showDraft, setShowDraft] = useState<boolean>(false)
  const [showVerification, setShowVerification] = useState<boolean>(false)
  const [reFetchDT, setReFetchDT] = useState<boolean>(false)
  const [initializedDT, setInitializedDT] = useState<boolean>(false)
  const [filterDT, setFilterDT] = useState({ rkt_tahun: '', rkt_anggaran: '', rkt_name: '', status: '' })
  const [queryParams, setQueryParams] = useState<Record<string, any>>({ sort_field: 'id', sort_dir: 'ASC', join: 'rkt' })
  const [anggaranFilter, setAnggaranFilter] = useState<Array<string>>([])
  const [yearFilter, setYearFilter] = useState<Array<string>>([])
  const [columns, setColumns] = useState<Array<Column>>([])
  const [id, setId] = useState<number>(0)

  useEffect(() => {
    apiGet('/perjanjian-kerja/filter').then(res => {
      setYearFilter(res?.data?.tahun)
      setAnggaranFilter(res?.data?.anggaran)

      const column: Array<Column> = [
        {
          id: 'rkt.name',
          label: 'id',
          labelFromDataField: 'id',
          minWidth: 120,
          noWrap: true,
          maxWidth: 200,
          fontSize: isMobile ? 11 : undefined
        },
        {
          id: 'rkt.usulan_anggaran',
          label: 'Usulan Anggaran',
          align: 'center',
          transform: value => (value as number).toLocaleString(undefined, { maximumFractionDigits: 0 }).replace(/,/g, '.'),
          minWidth: 150,
          fontSize: isMobile ? 11 : undefined
        },
        {
          id: 'rkt.tahun',
          label: 'Tahun Pengajuan',
          align: 'center',
          fontSize: isMobile ? 11 : undefined,
          minWidth: 100
        },
        {
          id: 'status',
          label: 'Status',
          transform: value => {
            let status = ReverseVerificationStatus[value as string] || '-'
            if (value === '0') status += ' Admin'

            return status
          },
          isBadge: true,
          badgeColor: value => VerificationStatusColor[value as string],
          fontSize: isMobile ? 11 : undefined,
          minWidth: 200
        }
      ]

      if (
        ability.can('create', 'perjanjian-kerja') ||
        ability.can('update', 'perjanjian-kerja') ||
        ability.can('approve', 'perjanjian-kerja')
      ) {
        column.push({ id: 'action', label: 'Aksi', minWidth: 120, fontSize: isMobile ? 11 : undefined })
      }

      setColumns(column)

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
  const handleDetailClick = (pk: Record<string, any>) => {
    setShowDetail(true)
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
                    sx={{ backgroundColor: 'white', fontSize: isMobile ? 11 : 15, minWidth: 250 }}
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
                    sx={{ backgroundColor: 'white', fontSize: isMobile ? 11 : 15, maxWidth: 170 }}
                    onChange={event => {
                      const value = event.target.value
                      if (value !== '0') setFilterDT({ ...filterDT, rkt_tahun: value })
                      else setFilterDT({ ...filterDT, rkt_tahun: '' })
                    }}
                  >
                    <MenuItem value='0' sx={{ [theme.breakpoints.only('xs')]: { fontSize: 11, minHeight: 0 } }}>
                      Tahun RKT
                    </MenuItem>
                    {yearFilter.map(item => (
                      <MenuItem key={item} value={item} sx={{ [theme.breakpoints.only('xs')]: { fontSize: 11, minHeight: 0 } }}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item>
                  <Select
                    value={filterDT.rkt_anggaran || '0'}
                    size={'small'}
                    sx={{ backgroundColor: 'white', fontSize: isMobile ? 11 : 15, maxWidth: 170 }}
                    onChange={event => {
                      const value = event.target.value
                      if (value !== '0') setFilterDT({ ...filterDT, rkt_anggaran: value })
                      else setFilterDT({ ...filterDT, rkt_anggaran: '' })
                    }}
                  >
                    <MenuItem value='0' sx={{ [theme.breakpoints.only('xs')]: { fontSize: 11, minHeight: 0 } }}>
                      Usulan Anggaran
                    </MenuItem>
                    {anggaranFilter?.map(item => (
                      <MenuItem key={item} value={item} sx={{ [theme.breakpoints.only('xs')]: { fontSize: 11, minHeight: 0 } }}>
                        {currencyFormatter.format(Number(item))}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item>
                  <Select
                    value={filterDT.status || '0'}
                    size={'small'}
                    sx={{ backgroundColor: 'white', fontSize: isMobile ? 11 : 15, maxWidth: 170 }}
                    onChange={event => {
                      const value = event.target.value
                      if (value !== '0') setFilterDT({ ...filterDT, status: value })
                      else setFilterDT({ ...filterDT, status: '' })
                    }}
                  >
                    <MenuItem value='0' sx={{ [theme.breakpoints.only('xs')]: { fontSize: 11, minHeight: 0 } }}>
                      Status
                    </MenuItem>
                    {Object.keys(VerificationStatus).map(key => {
                      if (VerificationStatus[key] !== '0') {
                        return (
                          <MenuItem
                            sx={{ [theme.breakpoints.only('xs')]: { fontSize: 11, minHeight: 0 } }}
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
                        height: 40
                      }}
                      size={'small'}
                    >
                      <Grid alignItems={'center'} container>
                        <Grid mt={1.2} item>
                          <MicrosoftExcel sx={{ color: 'white' }} fontSize={isMobile ? 'small' : 'medium'} />
                        </Grid>
                        <Grid item ml={2}>
                          <Typography color={'white'} fontSize={isMobile ? 11 : 12} fontWeight={'bold'}>
                            Download Excel
                          </Typography>
                        </Grid>
                      </Grid>
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box mt={7}>
            <CustomTable
              columns={columns}
              url={'perjanjian-kerja'}
              initialized={initializedDT}
              reFetch={reFetchDT}
              setReFetch={setReFetchDT}
              setInitialized={setInitializedDT}
              queryParams={queryParams}
              customIcon={data => (
                <Grid container>
                  <Grid item>
                    {(ability.can('create', 'perjanjian-kerja') || ability.can('update', 'perjanjian-kerja')) && (
                      <IconButton title={'Download Draft'} onClick={() => handleDraftClick(data)}>
                        <CloudDownload />
                      </IconButton>
                    )}
                  </Grid>
                  <Grid item>
                    {(ability.can('create', 'perjanjian-kerja') || ability.can('update', 'perjanjian-kerja')) && (
                      <IconButton title={'Upload Perjanjian Kerja'} onClick={() => handleDetailClick(data)}>
                        <CloudUpload />
                      </IconButton>
                    )}
                  </Grid>
                  <Grid item>
                    {ability.can('approve', 'perjanjian-kerja') && (
                      <IconButton title={'Verifikasi'} onClick={() => handleVerificationClick(data)}>
                        <ReceiptTextCheck />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              )}
              paginationFontSize={isMobile ? 12 : undefined}
            />
          </Box>
          {showDetail && (
            <PerjanjianKerjaModal
              type={'ubah'}
              handleClose={hasData => {
                setShowDetail(false)
                if (hasData) setReFetchDT(true)
              }}
              id={id}
            />
          )}
          {showDraft && <DraftPerjanjianKerja id={id} handleClose={setShowDraft} />}
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
