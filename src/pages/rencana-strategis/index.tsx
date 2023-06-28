import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { OutlinedInput, Select, useTheme } from '@mui/material'
import TableStickyHeader from '../../views/tables/TableStickyHeader'
import { MicrosoftExcel, PlusCircleOutline } from 'mdi-material-ui'
import RencanaStrategisModal from '../../@core/components/rencana-strategis/modal'
import { useEffect, useRef, useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import { apiGet } from '../../util/api-fetch'
import LoaderPage from '../../views/loader'
import DeleteModal from '../../@core/components/modal/delete'

export default function UserPage() {
  const theme = useTheme()

  const keywordRef = useRef<HTMLInputElement>()
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [showAdd, setShowAdd] = useState<boolean>(false)
  const [showDelete, setShowDelete] = useState<boolean>(false)
  const [data, setData] = useState<Record<string, any>>({})
  const [reFetchDT, setReFetchDT] = useState<boolean>(false)
  const [initializedDT, setInitializedDT] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [filterTahun, setFilterTahun] = useState<string[]>([])
  const [filterDT, setFilterDT] = useState({ status: '', keyword: '', tahun: '' })
  const [queryParams, setQueryParams] = useState<Record<string, any>>({ sort_field: 'id', sort_dir: 'ASC' })

  useEffect(() => {
    apiGet('/rencana-strategis/filter').then(res => {
      setFilterTahun(res.data.tahun)
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    setQueryParams({ ...queryParams, ...filterDT })
    setReFetchDT(true)
  }, [filterDT])

  const handleRowClick = (data: Record<string, any>) => {
    setShowDetail(true)
    setData(data)
  }

  const handleEditClick = (data: Record<string, any>) => {
    setShowEdit(true)
    setData(data)
  }

  const handleDeleteClick = (data: Record<string, any>) => {
    setShowDelete(true)
    setData(data)
  }

  const handleAddClick = () => {
    setShowAdd(true)
  }

  let idleTimer: NodeJS.Timeout

  return (
    <>
      {isLoading && <LoaderPage />}
      {!isLoading && (
        <Box>
          <Typography variant={'h6'} fontWeight={'bold'} color={'primary'}>
            Data Renstra
          </Typography>
          <Typography variant={'body2'}>Daftar Rancangan Strategis</Typography>
          <Grid rowSpacing={2} justifyContent={'space-between'} mt={10} container>
            <Grid item>
              <Grid spacing={3} container>
                <Grid item>
                  <OutlinedInput
                    placeholder={'Cari Tujuan/Sasaran Strategis...'}
                    size={'small'}
                    sx={{ backgroundColor: 'white', fontSize: 15, minWidth: 270 }}
                    onKeyUp={() => {
                      if (idleTimer) clearTimeout(idleTimer)

                      idleTimer = setTimeout(() => {
                        setFilterDT({ ...filterDT, keyword: keywordRef.current?.value || '' })
                      }, 500)
                    }}
                    inputRef={keywordRef}
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
                    <MenuItem value='0'>Tahun Renstra</MenuItem>
                    {filterTahun.map(item => (
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
                    sx={{ backgroundColor: 'white', fontSize: 15, maxWidth: 120 }}
                    onChange={event => {
                      const value = event.target.value
                      if (value !== '0') setFilterDT({ ...filterDT, status: value })
                      else setFilterDT({ ...filterDT, status: '' })
                    }}
                  >
                    <MenuItem value='0'>Status</MenuItem>
                    <MenuItem value='true'>Aktif</MenuItem>
                    <MenuItem value='false'>Tidak Aktif</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid spacing={3} justifyContent={'right'} container>
                <Grid item>
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
                </Grid>
                <Grid item>
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
                          Tambah Renstra
                        </Typography>
                      </Grid>
                    </Grid>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box mt={5}>
            <TableStickyHeader
              columns={[
                { id: 'id', label: 'ID Renstra', minWidth: 120 },
                { id: 'tujuan', label: 'Tujuan Strategis' },
                { id: 'sasaran', label: 'Sasaran Strategis', minWidth: 160 },
                { id: 'tahun', label: 'Tahun' },
                {
                  id: 'is_active',
                  label: 'Status',
                  transform: value => (value === true ? 'Aktif' : 'Tidak Aktif'),
                  minWidth: 110
                },
                { id: 'action', label: 'Aksi', content: { edit: true, delete: true }, minWidth: 120 }
              ]}
              url={'rencana-strategis'}
              queryParams={queryParams}
              handleRowClick={handleRowClick}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              reFetch={reFetchDT}
              setReFetch={setReFetchDT}
              initialized={initializedDT}
              setInitialized={setInitializedDT}
            />
          </Box>
          {showDetail && <RencanaStrategisModal data={data} type={'detail'} handleClose={() => setShowDetail(false)} />}
          {showEdit && (
            <RencanaStrategisModal
              data={data}
              type={'ubah'}
              handleClose={(hasData: boolean) => {
                setShowEdit(false)
                if (hasData) setReFetchDT(true)
              }}
            />
          )}
          {showAdd && (
            <RencanaStrategisModal
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
              modalTitle={'Rancangan Strategis'}
              title={`Tujuan : ${data?.tujuan}`}
              subTitle={`Sasaran : ${data?.sasaran}`}
              id={data?.id}
              url={'rencana-strategis'}
            />
          )}
        </Box>
      )}
    </>
  )
}
