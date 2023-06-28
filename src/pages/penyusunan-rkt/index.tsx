import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { MicrosoftExcel, PlusCircleOutline } from 'mdi-material-ui'
import { OutlinedInput, Select, useTheme } from '@mui/material'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import LoaderPage from '../../views/loader'
import { apiGet } from '../../util/api-fetch'
import { ReverseVerificationStatus, VerificationStatus, VerificationStatusColor } from '../../configs/enum'
import CustomTable from '../../views/tables/CustomTable'
import DeleteModal from '../../@core/components/modal/delete'
import PenyusunanRKTModal from '../../@core/components/penyusunan-rkt/modal'
import LoaderModal from '../../@core/components/modal/loader'
import PenyusunanRKTVerification from '../../@core/components/penyusunan-rkt/verification'
import { AbilityContext } from '../../@core/layouts/components/acl/Can'

const PenyusunanRktPage = () => {
  // state
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modalLoading, setModalLoading] = useState<boolean>(false)
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

  useMemo(() => {
    if (id) {
      setModalLoading(true)
      apiGet(baseUrl + '/' + id).then(res => {
        setModalLoading(false)
        setData(res?.data)
      })
    }
  }, [id])

  // HTML ref
  const nameRef = useRef<HTMLInputElement>()

  const theme = useTheme()
  const ability = useContext(AbilityContext)

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

  let idleTimer: NodeJS.Timeout

  return (
    <>
      {isLoading && <LoaderPage />}
      {modalLoading && <LoaderModal />}
      {!isLoading && (
        <Box>
          <Typography variant={'h6'} fontWeight={'bold'} color={'primary'}>
            Penyusunan RKT
          </Typography>
          <Typography variant={'body2'}>Daftar Rancangan Kinerja Tahunan</Typography>
          <Grid rowSpacing={2} justifyContent={'space-between'} mt={10} container>
            <Grid item>
              <Grid spacing={3} container>
                <Grid item>
                  <OutlinedInput
                    placeholder={'Nama RKT...'}
                    size={'small'}
                    sx={{ backgroundColor: 'white', fontSize: 15, minWidth: 250 }}
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
                    sx={{ backgroundColor: 'white', fontSize: 15, maxWidth: 170 }}
                    onChange={event => {
                      const value = event.target.value
                      if (value !== '0') setFilterDT({ ...filterDT, tahun: value })
                      else setFilterDT({ ...filterDT, tahun: '' })
                    }}
                  >
                    <MenuItem value='0'>Tahun RKT</MenuItem>
                    {yearFilter.map(item => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item>
                  <Select
                    value={filterDT.submit_name || '0'}
                    size={'small'}
                    sx={{ backgroundColor: 'white', fontSize: 15, maxWidth: 170 }}
                    onChange={event => {
                      const value = event.target.value
                      if (value !== '0') setFilterDT({ ...filterDT, submit_name: value })
                      else setFilterDT({ ...filterDT, submit_name: '' })
                    }}
                  >
                    <MenuItem value='0'>Pengusul</MenuItem>
                    {submitFilter.map(item => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item>
                  <Select
                    value={filterDT.status || '0'}
                    size={'small'}
                    sx={{ backgroundColor: 'white', fontSize: 15, maxWidth: 170 }}
                    onChange={event => {
                      const value = event.target.value
                      if (value !== '0') setFilterDT({ ...filterDT, status: value })
                      else setFilterDT({ ...filterDT, status: '' })
                    }}
                  >
                    <MenuItem value='0'>Status</MenuItem>
                    {Object.keys(VerificationStatus).map(key => {
                      if (VerificationStatus[key] !== '0') {
                        return (
                          <MenuItem key={key} value={VerificationStatus[key]}>
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
                  {ability.can('download', 'penyusunan-rkt') && (
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
                      onClick={handleAddClick}
                    >
                      <Grid alignItems={'center'} container>
                        <Grid mt={1.2} item>
                          <MicrosoftExcel sx={{ color: 'white' }} />
                        </Grid>
                        <Grid item ml={2}>
                          <Typography color={'white'} fontSize={12} fontWeight={'bold'}>
                            Download Excel
                          </Typography>
                        </Grid>
                      </Grid>
                    </Button>
                  )}
                </Grid>
                <Grid item>
                  {ability.can('create', 'penyusunan-rkt') && (
                    <Button
                      sx={{
                        backgroundImage: `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.main} 150%)`,
                        justifyContent: 'space-between',
                        verticalAlign: 'center',
                        alignItems: 'center',
                        boxShadow: 5,
                        height: 40
                      }}
                      size={'small'}
                      onClick={handleAddClick}
                    >
                      <Grid alignItems={'center'} container>
                        <Grid mt={1.2} item>
                          <PlusCircleOutline sx={{ color: 'white' }} />
                        </Grid>
                        <Grid item ml={2}>
                          <Typography color={'white'} fontSize={12} fontWeight={'bold'}>
                            Tambah RKT
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
              columns={[
                { id: 'name', label: 'id', labelFromDataField: 'id', minWidth: 120, noWrap: true, maxWidth: 200 },
                {
                  id: 'usulan_anggaran',
                  label: 'Usulan Anggaran',
                  align: 'center',
                  transform: value =>
                    (value as number).toLocaleString(undefined, { maximumFractionDigits: 0 }).replace(/,/g, '.'),
                  minWidth: 170
                },
                {
                  id: 'user_submit.name',
                  label: 'Pengusul',
                  minWidth: 100,
                  maxWidth: 200,
                  align: 'center',
                  noWrap: true
                },
                { id: 'tahun', label: 'Tahun Pengajuan', align: 'center' },
                {
                  id: 'status',
                  label: 'Status',
                  transform: (value, data) => {
                    if (ReverseVerificationStatus[value as string]) {
                      return ReverseVerificationStatus[value as string] + ' ' + (data.verification_role?.name || '')
                    }
                  },
                  isBadge: true,
                  badgeColor: value => VerificationStatusColor[value as string],
                  badgeOnClick: ability.can('approve', 'penyusunan-rkt') ? handleApproveClick : undefined
                },
                {
                  id: 'action',
                  label: 'Aksi',
                  content: {
                    edit: ability.can('update', 'penyusunan-rkt'),
                    delete: ability.can('delete', 'penyusunan-rkt'),
                    detail: ability.can('read', 'penyusunan-rkt')
                  },
                  minWidth: 150
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
            />
          </Box>
          {showDetail && <PenyusunanRKTModal data={data} type={'detail'} handleClose={() => setShowDetail(false)} />}
          {showApproval && (
            <PenyusunanRKTVerification
              data={data}
              handleClose={(hasData: boolean) => {
                setShowApproval(false)
                if (hasData) setReFetchDT(true)
              }}
            />
          )}
          {showEdit && (
            <PenyusunanRKTModal
              data={data}
              type={'ubah'}
              handleClose={(hasData: boolean) => {
                setShowEdit(false)
                if (hasData) setReFetchDT(true)
              }}
            />
          )}
          {showAdd && (
            <PenyusunanRKTModal
              type={'tambah'}
              handleClose={(hasData: boolean) => {
                setShowAdd(false)
                if (hasData) setReFetchDT(true)
              }}
            />
          )}
          {showDelete && (
            <DeleteModal
              handleClose={(hasData: boolean) => {
                setShowDelete(false)
                if (hasData) setReFetchDT(true)
              }}
              modalTitle={'Penyusunan RKT'}
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

PenyusunanRktPage.acl = {
  action: ['approve', 'create', 'update', 'read'],
  subject: 'penyusunan-rkt'
}

export default PenyusunanRktPage
