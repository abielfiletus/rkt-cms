import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { OutlinedInput, Select, useTheme } from '@mui/material'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import LoaderPage from '../../views/loader'
import { apiGet } from '../../util/api-fetch'
import { CapaianStatus, CapaianStatusColor, ReverseCapaianStatus } from '../../configs/enum'
import CustomTable from '../../views/tables/CustomTable'
import LoaderModal from '../../@core/components/modal/loader'
import PenyusunanRKTVerification from '../../@core/components/penyusunan-rkt/verification'
import CapaianModal from '../../@core/components/capaian/modal'
import DetailCapaian from '../../@core/components/capaian/detail'
import { AbilityContext } from '../../@core/layouts/components/acl/Can'

interface IPropTwButton {
  tw_index: number
  id: number
  disabled: boolean
}

const CapaianPage = () => {
  // state
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modalLoading, setModalLoading] = useState<boolean>(false)
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [showApproval, setShowApproval] = useState<boolean>(false)
  const [showInputTw, setShowInputTw] = useState<boolean>(false)
  const [reFetchDT, setReFetchDT] = useState<boolean>(false)
  const [initializedDT, setInitializedDT] = useState<boolean>(false)
  const [data, setData] = useState<Record<string, any>>({})
  const [filterDT, setFilterDT] = useState({ tahun: '', submit_name: '', name: '', status: '' })
  const [queryParams, setQueryParams] = useState<Record<string, any>>({ sort_field: 'id', sort_dir: 'ASC' })
  const [submitFilter, setSubmitFilter] = useState<Array<string>>([])
  const [yearFilter, setYearFilter] = useState<Array<string>>([])
  const [id, setId] = useState<number>()

  const theme = useTheme()
  const ability = useContext(AbilityContext)

  const baseUrl = '/capaian'

  useEffect(() => {
    apiGet('/penyusunan-rkt/filter').then(res => {
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

  // handler
  const handleDetailClick = (data: Record<string, any>) => {
    setId(data.id)
    setShowDetail(true)
  }
  const handleShowInputTwClick = (tw_index: number, id: number) => {
    setShowInputTw(true)
    setId(id)
  }

  let idleTimer: NodeJS.Timeout

  const TwButton = (prop: IPropTwButton) => {
    const { tw_index, id, disabled } = prop

    return (
      <Box
        sx={{
          cursor: disabled ? 'default' : 'pointer',
          fontWeight: 'bold',
          fontSize: 14,
          color: disabled ? theme.palette.grey['500'] : 'black'
        }}
        onClick={disabled ? undefined : () => handleShowInputTwClick(tw_index, id)}
      >
        TW {tw_index}
      </Box>
    )
  }

  return (
    <>
      {isLoading && <LoaderPage />}
      {modalLoading && <LoaderModal />}
      {!isLoading && (
        <Box>
          <Typography variant={'h6'} fontWeight={'bold'} color={'primary'}>
            Daftar Capaian
          </Typography>
          <Typography variant={'body2'}>Daftar Capaian Berdasarkan RKT yang di setujui</Typography>
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
                    value={filterDT.status || '-1'}
                    size={'small'}
                    sx={{ backgroundColor: 'white', fontSize: 15, maxWidth: 170 }}
                    onChange={event => {
                      const value = event.target.value
                      if (value !== '-1') setFilterDT({ ...filterDT, status: value })
                      else setFilterDT({ ...filterDT, status: '' })
                    }}
                  >
                    <MenuItem value='-1'>Status</MenuItem>
                    {Object.keys(ReverseCapaianStatus).map(key => (
                      <MenuItem key={key} value={ReverseCapaianStatus[key]}>
                        {key}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box mt={7}>
            <CustomTable
              columns={[
                { id: 'rkt.name', label: 'id', labelFromDataField: 'id', minWidth: 120, noWrap: true, maxWidth: 200 },
                {
                  id: 'rkt.usulan_anggaran',
                  label: 'Usulan Anggaran',
                  align: 'center',
                  transform: value =>
                    (value as number).toLocaleString(undefined, { maximumFractionDigits: 0 }).replace(/,/g, '.'),
                  minWidth: 170
                },
                { id: 'rkt.tahun', label: 'Tahun Pengajuan', align: 'center' },
                {
                  id: 'status',
                  label: 'Status Capaian',
                  align: 'center',
                  transform: value => {
                    if (CapaianStatus[value as string]) {
                      return (
                        <Typography variant={'caption'} fontWeight={'bold'} color={CapaianStatusColor[value as string]}>
                          {CapaianStatus[value as string]}
                        </Typography>
                      )
                    }
                  }
                },
                {
                  id: 'id',
                  label: '',
                  transform: value => {
                    if (ability.can('create', 'capaian') || ability.can('update', 'capaian')) {
                      return (
                        <Grid columnSpacing={3} container>
                          <Grid item>
                            <TwButton tw_index={1} id={value as number} disabled={false} />
                          </Grid>
                          <Grid item>
                            <TwButton tw_index={2} id={value as number} disabled={true} />
                          </Grid>
                          <Grid item>
                            <TwButton tw_index={3} id={value as number} disabled={true} />
                          </Grid>
                          <Grid item>
                            <TwButton tw_index={4} id={value as number} disabled={true} />
                          </Grid>
                        </Grid>
                      )
                    }
                  }
                },
                { id: 'action', label: 'Aksi', content: { detail: true }, minWidth: 150 }
              ]}
              url={'capaian'}
              initialized={initializedDT}
              reFetch={reFetchDT}
              setReFetch={setReFetchDT}
              setInitialized={setInitializedDT}
              queryParams={queryParams}
              handleDetailClick={handleDetailClick}
            />
          </Box>
          {showDetail && <DetailCapaian data={data} type={'detail'} handleClose={() => setShowDetail(false)} id={id} />}
          {showApproval && (
            <PenyusunanRKTVerification
              data={data}
              handleClose={(hasData: boolean) => {
                setShowApproval(false)
                if (hasData) setReFetchDT(true)
              }}
            />
          )}
          {showInputTw && (
            <CapaianModal
              data={data}
              id={id}
              type={'ubah'}
              handleClose={(hasData: boolean) => {
                setShowInputTw(false)
                if (hasData) setReFetchDT(true)
              }}
            />
          )}
        </Box>
      )}
    </>
  )
}

CapaianPage.acl = {
  action: ['create', 'update', 'read', 'delete', 'approve'],
  subject: 'capaian'
}

export default CapaianPage
