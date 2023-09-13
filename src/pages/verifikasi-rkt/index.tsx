import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { DeleteOutline, FileEyeOutline, MicrosoftExcel, PencilOutline } from 'mdi-material-ui'
import { OutlinedInput, Select, useTheme } from '@mui/material'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import LoaderPage from '../../views/loader'
import { apiGet } from '../../util/api-fetch'
import { ReverseVerificationStatus, VerificationStatus, VerificationStatusColor } from '../../configs/enum'
import CustomTable from '../../views/tables/CustomTable'
import DeleteModal from '../../@core/components/modal/delete'
import VerifikasiRKTModal from '../../@core/components/penyusunan-rkt/modal'
import VerifikasiRKTVerification from '../../@core/components/penyusunan-rkt/verification'
import { AbilityContext } from '../../@core/layouts/components/acl/Can'
import useMediaQuery from '@mui/material/useMediaQuery'
import IconButton from '@mui/material/IconButton'
import { useAuth } from '../../@core/hooks/useAuth'
import { MenuBadgeContext } from '../../@core/context/MenuBadgeContext'

const VerifikasiRktPage = () => {
  // state
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [showAdd, setShowAdd] = useState<boolean>(false)
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [showDelete, setShowDelete] = useState<boolean>(false)
  const [showApproval, setShowApproval] = useState<boolean>(false)
  const [reFetchDT, setReFetchDT] = useState<boolean>(false)
  const [initializedDT, setInitializedDT] = useState<boolean>(false)
  const [data, setData] = useState<Record<string, any>>({})
  const [filterDT, setFilterDT] = useState({ tahun: '', submit_name: '', name: '', status: '' })
  const [queryParams, setQueryParams] = useState<Record<string, any>>({ sort_field: 'id', sort_dir: 'ASC' })
  const [submitFilter, setSubmitFilter] = useState<Array<string>>([])
  const [yearFilter, setYearFilter] = useState<Array<string>>([])
  const [id, setId] = useState<number>()
  const menuBadgeContext = useContext(MenuBadgeContext)
  const baseUrl = '/penyusunan-rkt'

  useEffect(() => {
    apiGet(baseUrl + '/filter').then(res => {
      setYearFilter(res?.data?.tahun)
      setSubmitFilter(res?.data?.submit_user)
      setIsLoading(false)
    })
  }, [])

  useMemo(() => {
    setQueryParams({ ...queryParams, ...filterDT })
    setReFetchDT(true)
  }, [filterDT])

  // HTML ref
  const nameRef = useRef<HTMLInputElement>()

  const auth = useAuth()
  const theme = useTheme()
  const ability = useContext(AbilityContext)
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'))

  // handler
  const handleDetailClick = (data: Record<string, any>) => {
    // apiGet(baseUrl + '/' + data.id).then(res => {
    setId(data.id)
    // setModalLoading(false)
    setShowDetail(true)
    // setData(res?.data)
    // })
  }
  const handleApproveClick = (data: Record<string, any>) => {
    setId(data.id)
    setShowApproval(true)
  }
  const handleEditClick = (data: Record<string, any>) => {
    setId(data.id)
    setShowEdit(true)
  }
  const handleDeleteClick = (data: Record<string, any>) => {
    setShowDelete(true)
    setData(data)
  }
  const handleAddClick = () => setShowAdd(true)
  const handleCloseVerification = async () => {
    const res = await apiGet('/penyusunan-rkt/outstanding-summary')
    menuBadgeContext.setVerifyRkt(res?.data)
    setReFetchDT(true)
  }

  let idleTimer: NodeJS.Timeout

  return (
    <>
      {isLoading && <LoaderPage />}
      {!isLoading && (
        <Box>
          <Typography variant={'h6'} fontWeight={'bold'} color={'primary'}>
            Verifikasi RKT
          </Typography>
          <Typography variant={'body2'}>Daftar Rancangan Kinerja Tahunan</Typography>
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
                        setFilterDT({ ...filterDT, name: nameRef.current?.value || '' })
                      }, 500)
                    }}
                    inputRef={nameRef}
                  />
                </Grid>
                <Grid item>
                  <Select
                    value={filterDT.tahun || '0'}
                    size={'small'}
                    sx={{ backgroundColor: 'white', fontSize: isMobile ? 10 : 11, minWidth: 250 }}
                    onChange={event => {
                      const value = event.target.value
                      if (value !== '0') setFilterDT({ ...filterDT, tahun: value })
                      else setFilterDT({ ...filterDT, tahun: '' })
                    }}
                  >
                    <MenuItem sx={{ fontSize: 12, [theme.breakpoints.only('xs')]: { fontSize: 11, minHeight: 0 } }} value='0'>
                      Tahun RKT
                    </MenuItem>
                    {yearFilter.map(item => (
                      <MenuItem
                        sx={{ fontSize: 12, [theme.breakpoints.only('xs')]: { fontSize: 11, minHeight: 0 } }}
                        key={item}
                        value={item}
                      >
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item>
                  <Select
                    value={filterDT.submit_name || '0'}
                    size={'small'}
                    sx={{ backgroundColor: 'white', fontSize: isMobile ? 10 : 11, minWidth: 250 }}
                    onChange={event => {
                      const value = event.target.value
                      if (value !== '0') setFilterDT({ ...filterDT, submit_name: value })
                      else setFilterDT({ ...filterDT, submit_name: '' })
                    }}
                  >
                    <MenuItem sx={{ fontSize: 12, [theme.breakpoints.only('xs')]: { fontSize: 11, minHeight: 0 } }} value='0'>
                      Pengusul
                    </MenuItem>
                    {submitFilter.map(item => (
                      <MenuItem
                        sx={{ fontSize: 12, [theme.breakpoints.only('xs')]: { fontSize: 11, minHeight: 0 } }}
                        key={item}
                        value={item}
                      >
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid spacing={3} justifyContent={'right'} container>
                <Grid item>
                  {ability.can('download', 'penyusunan-rkt') && (
                    <Button
                      sx={{
                        backgroundImage: `linear-gradient(98deg, ${theme.palette.customColors.successGradient}, ${theme.palette.success.main} 150%)`,
                        justifyContent: 'space-between',
                        verticalAlign: 'center',
                        alignItems: 'center',
                        boxShadow: 4,
                        height: 35
                      }}
                      size={'small'}
                      onClick={handleAddClick}
                    >
                      <Grid alignItems={'center'} container>
                        <Grid mt={1.2} item>
                          <MicrosoftExcel sx={{ color: 'white' }} fontSize={'small'} />
                        </Grid>
                        <Grid item ml={2}>
                          <Typography color={'white'} fontSize={isMobile ? 10 : 11} fontWeight={'bold'}>
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
          <Box mt={3}>
            <CustomTable
              columns={[
                {
                  id: 'name',
                  label: 'id',
                  labelFromDataField: 'id',
                  minWidth: 120,
                  noWrap: true,
                  maxWidth: 200,
                  fontSize: isMobile ? 10 : 11.5
                },
                {
                  id: 'usulan_anggaran',
                  label: 'Usulan Anggaran',
                  align: 'center',
                  transform: value =>
                    (value as number).toLocaleString(undefined, { maximumFractionDigits: 0 }).replace(/,/g, '.'),
                  minWidth: 150,
                  fontSize: isMobile ? 10 : 11.5
                },
                {
                  id: 'user_submit.name',
                  label: 'Pengusul',
                  minWidth: 100,
                  maxWidth: 200,
                  align: 'center',
                  noWrap: true,
                  fontSize: isMobile ? 10 : 11.5
                },
                { id: 'tahun', label: 'Tahun Pengajuan', align: 'center', fontSize: isMobile ? 10 : 11.5 },
                {
                  id: 'status',
                  label: 'Status',
                  transform: (value, data) => {
                    if (ReverseVerificationStatus[value as string]) {
                      if (value === VerificationStatus.Revisi && data.verification_role_target === auth.user?.role?.id) {
                        return ReverseVerificationStatus[value as string]
                      }

                      return ReverseVerificationStatus[value as string] + ' ' + (data.verification_role?.name || '')
                    }
                  },
                  isBadge: true,
                  badgeColor: value => VerificationStatusColor[value as string],
                  badgeOnClick: ability.can('approve', 'penyusunan-rkt') ? handleApproveClick : undefined,
                  fontSize: isMobile ? 10 : 11,
                  minWidth: 150
                },
                {
                  id: 'action',
                  label: 'Aksi',
                  minWidth: isMobile ? 150 : undefined,
                  iconSize: 'small'
                }
              ]}
              url={'penyusunan-rkt'}
              initialized={initializedDT}
              reFetch={reFetchDT}
              setReFetch={setReFetchDT}
              setInitialized={setInitializedDT}
              queryParams={queryParams}
              handleDeleteClick={handleDeleteClick}
              handleEditClick={handleEditClick}
              handleDetailClick={handleDetailClick}
              paginationFontSize={11.5}
              customIcon={data => {
                return (
                  <Grid container>
                    {ability.can('read', 'penyusunan-rkt') && (
                      <Grid item>
                        <IconButton onClick={() => handleDetailClick(data)}>
                          <FileEyeOutline color={'success'} fontSize={'small'} />
                        </IconButton>
                      </Grid>
                    )}
                    {(auth.user?.role?.id === 1 ||
                      (ability.can('update', 'penyusunan-rkt') &&
                        data.status === VerificationStatus.Revisi &&
                        data.verification_role_target === auth.user?.role?.id)) &&
                      data.status !== VerificationStatus.Selesai && (
                        <Grid item>
                          <IconButton onClick={() => handleEditClick(data)}>
                            <PencilOutline color={'primary'} fontSize={'small'} />
                          </IconButton>
                        </Grid>
                      )}
                    {(auth.user?.role?.id === 1 ||
                      (ability.can('delete', 'penyusunan-rkt') &&
                        data.status === VerificationStatus.Revisi &&
                        data.verification_role_target === auth.user?.role?.id)) &&
                      data.status !== VerificationStatus.Selesai && (
                        <Grid item>
                          <IconButton onClick={() => handleDeleteClick(data)}>
                            <DeleteOutline color={'error'} fontSize={'small'} />
                          </IconButton>
                        </Grid>
                      )}
                  </Grid>
                )
              }}
            />
          </Box>
          {showDetail && <VerifikasiRKTModal id={id} type={'detail'} handleClose={() => setShowDetail(false)} />}
          {showApproval && (
            <VerifikasiRKTVerification
              id={id as number}
              handleClose={async (hasData: boolean) => {
                setShowApproval(false)
                if (hasData) await handleCloseVerification()
              }}
            />
          )}
          {showEdit && (
            <VerifikasiRKTModal
              id={id}
              type={'ubah'}
              handleClose={async (hasData: boolean) => {
                setShowEdit(false)
                if (hasData) await handleCloseVerification()
              }}
            />
          )}
          {showAdd && (
            <VerifikasiRKTModal
              type={'tambah'}
              handleClose={async (hasData: boolean) => {
                setShowAdd(false)
                if (hasData) await handleCloseVerification()
              }}
            />
          )}
          {showDelete && (
            <DeleteModal
              handleClose={(hasData: boolean) => {
                setShowDelete(false)
                if (hasData) setReFetchDT(true)
              }}
              modalTitle={'Verifikasi RKT'}
              title={data?.name}
              id={data?.id}
              url={'penyusunan-rkt'}
            />
          )}
        </Box>
      )}
    </>
  )
}

VerifikasiRktPage.acl = {
  action: ['approve', 'create', 'update', 'read'],
  subject: 'penyusunan-rkt'
}

export default VerifikasiRktPage
