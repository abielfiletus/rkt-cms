import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { OutlinedInput, useTheme } from '@mui/material'
import TableStickyHeader from '../../views/tables/TableStickyHeader'
import { MicrosoftExcel, PlusCircleOutline } from 'mdi-material-ui'
import IKUModal from '../../@core/components/indikator-kinerja-utama/modal'
import { useContext, useMemo, useRef, useState } from 'react'
import DeleteModal from '../../@core/components/modal/delete'
import { AbilityContext } from '../../@core/layouts/components/acl/Can'
import useMediaQuery from '@mui/material/useMediaQuery'
import { apiGet } from '../../util/api-fetch'
import { toast } from 'react-toastify'

const IndikatorKinerjaUtamaPage = () => {
  const theme = useTheme()
  const ability = useContext(AbilityContext)
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'))

  const nameRef = useRef<HTMLInputElement>()
  const nodRef = useRef<HTMLInputElement>()
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false)
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [showAdd, setShowAdd] = useState<boolean>(false)
  const [showDelete, setShowDelete] = useState<boolean>(false)
  const [data, setData] = useState<Record<string, any>>({})
  const [reFetchDT, setReFetchDT] = useState<boolean>(false)
  const [initializedDT, setInitializedDT] = useState<boolean>(false)
  const [filterDT, setFilterDT] = useState({ no: '', name: '' })
  const [queryParams, setQueryParams] = useState<Record<string, any>>({ sort_field: 'id', sort_dir: 'ASC' })

  useMemo(() => {
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
  const handleDownloadClick = async () => {
    setDownloadLoading(true)
    try {
      const download = await apiGet('/indikator-kinerja-utama/download', filterDT, { responseType: 'blob' })
      const href = URL.createObjectURL(download)

      const link = document.createElement('a')
      link.href = href
      link.setAttribute('download', 'Data Indikator Kinerja Utama.xlsx') //or any other extension
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

  let idleTimer: NodeJS.Timeout

  return (
    <Box>
      <Typography variant={'h6'} fontWeight={'bold'} color={'primary'}>
        Daftar IKU
      </Typography>
      <Typography variant={'body2'}>Daftar Indikator Kinerja Utama</Typography>
      <Grid justifyContent={'space-between'} mt={10} container>
        <Grid item>
          <Grid spacing={3} container>
            <Grid item>
              <OutlinedInput
                placeholder={'Nama IKU...'}
                size={'small'}
                sx={{ backgroundColor: 'white', fontSize: isMobile ? 10 : 15, minWidth: 250 }}
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
              <OutlinedInput
                placeholder={'No IKU...'}
                size={'small'}
                sx={{ backgroundColor: 'white', fontSize: isMobile ? 10 : 15, minWidth: 150 }}
                onKeyUp={() => {
                  if (idleTimer) clearTimeout(idleTimer)

                  idleTimer = setTimeout(() => {
                    setFilterDT({ ...filterDT, no: nodRef.current?.value || '' })
                  }, 500)
                }}
                inputRef={nodRef}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ [theme.breakpoints.down('md')]: { marginTop: 4 } }} item>
          <Grid spacing={3} justifyContent={'right'} container>
            <Grid item>
              {ability.can('download', 'indikator-kinerja-utama') && (
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
                  disabled={downloadLoading}
                  onClick={handleDownloadClick}
                >
                  <Grid alignItems={'center'} container>
                    <Grid mt={1.2} item>
                      <MicrosoftExcel sx={{ color: 'white' }} fontSize={isMobile ? 'small' : 'medium'} />
                    </Grid>
                    <Grid item ml={2}>
                      <Typography color={'white'} fontSize={isMobile ? 10 : 12} fontWeight={'bold'}>
                        {downloadLoading ? 'Downloading...' : 'Download Excel'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Button>
              )}
            </Grid>
            <Grid item>
              {ability.can('create', 'indikator-kinerja-utama') && (
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
                      <PlusCircleOutline sx={{ color: 'white' }} fontSize={isMobile ? 'small' : 'medium'} />
                    </Grid>
                    <Grid item ml={2}>
                      <Typography color={'white'} fontSize={isMobile ? 10 : 12} fontWeight={'bold'}>
                        Tambah IKU
                      </Typography>
                    </Grid>
                  </Grid>
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box mt={5}>
        <TableStickyHeader
          columns={[
            { id: 'no', label: 'Nomor IKU', fontSize: isMobile ? 10 : 13 },
            { id: 'name', label: 'Nama IKU', minWidth: 160, fontSize: isMobile ? 10 : 13 },
            {
              id: 'is_active',
              label: 'Status',
              transform: value => (value === true ? 'Aktif' : <Box color={theme.palette.grey['500']}>{'Tidak Aktif'}</Box>),
              minWidth: 110,
              fontSize: isMobile ? 10 : 13
            },
            {
              id: 'action',
              label: 'Aksi',
              content: {
                edit: ability.can('update', 'indikator-kinerja-utama'),
                delete: ability.can('delete', 'indikator-kinerja-utama')
              },
              minWidth: 120,
              fontSize: isMobile ? 10 : 13
            }
          ]}
          url={'indikator-kinerja-utama'}
          queryParams={queryParams}
          handleRowClick={handleRowClick}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          reFetch={reFetchDT}
          setReFetch={setReFetchDT}
          initialized={initializedDT}
          setInitialized={setInitializedDT}
          sx={{ fontWeight: 500, '& .MuiTableCell-body': { color: 'black' } }}
          paginationFontSize={isMobile ? 12 : undefined}
        />
      </Box>
      {showDetail && <IKUModal data={data} type={'detail'} handleClose={() => setShowDetail(false)} />}
      {showEdit && (
        <IKUModal
          data={data}
          type={'ubah'}
          handleClose={(hasData: boolean) => {
            setShowEdit(false)
            if (hasData) setReFetchDT(true)
          }}
        />
      )}
      {showAdd && (
        <IKUModal
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
          modalTitle={'Indikator Kinerja Utama (IKU)'}
          title={`${data?.name}`}
          id={data?.id}
          url={'indikator-kinerja-utama'}
        />
      )}
    </Box>
  )
}

IndikatorKinerjaUtamaPage.acl = {
  action: ['create', 'read', 'update', 'delete'],
  subject: 'indikator-kinerja-utama'
}

export default IndikatorKinerjaUtamaPage
