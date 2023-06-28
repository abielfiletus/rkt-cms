import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material'
import TableStickyHeader from '../../views/tables/TableStickyHeader'
import { FilePdfBox, PlusCircleOutline } from 'mdi-material-ui'
import DocumentModal from '../../@core/components/dokumen/modal'
import { useContext, useState } from 'react'
import DeleteModal from '../../@core/components/modal/delete'
import IconButton from '@mui/material/IconButton'
import { AbilityContext } from '../../@core/layouts/components/acl/Can'

const DocumentPage = () => {
  const theme = useTheme()
  const ability = useContext(AbilityContext)

  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [showAdd, setShowAdd] = useState<boolean>(false)
  const [showDelete, setShowDelete] = useState<boolean>(false)
  const [data, setData] = useState<Record<string, any>>({})
  const [reFetchDT, setReFetchDT] = useState<boolean>(false)
  const [initializedDT, setInitializedDT] = useState<boolean>(false)

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

  return (
    <Box>
      <Typography variant={'h6'} fontWeight={'bold'} color={'primary'}>
        Data Dokumen
      </Typography>
      <Box textAlign={'right'} mt={3}>
        {ability.can('create', 'dokumen') && (
          <Button
            sx={{
              backgroundImage: `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.main} 150%)`,
              justifyContent: 'space-between',
              verticalAlign: 'center',
              alignItems: 'center'
            }}
            onClick={handleAddClick}
          >
            <Grid alignItems={'center'} container>
              <Grid mt={1.2} item>
                <PlusCircleOutline sx={{ color: 'white' }} />
              </Grid>
              <Grid item ml={2}>
                <Typography color={'white'} variant={'body2'} fontWeight={'bold'}>
                  Tambah Dokumen
                </Typography>
              </Grid>
            </Grid>
          </Button>
        )}
      </Box>
      <Box mt={10}>
        <TableStickyHeader
          columns={[
            { id: 'id', label: 'ID' },
            { id: 'name', label: 'Nama Dokumen' },
            { id: 'description', label: 'Keterangan Dokumen' },
            {
              id: 'file',
              label: 'File',
              align: 'left',
              transform: value => (
                <IconButton onClick={() => window.open(process.env.NEXT_PUBLIC_BE_URL + '/' + value)}>
                  <FilePdfBox color={'error'} />
                </IconButton>
              )
            },
            {
              id: 'action',
              label: 'Aksi',
              minWidth: 120,
              content: { edit: ability.can('update', 'dokumen'), delete: ability.can('delete', 'dokumen') }
            }
          ]}
          url={'document'}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          reFetch={reFetchDT}
          setReFetch={setReFetchDT}
          initialized={initializedDT}
          setInitialized={setInitializedDT}
        />
      </Box>
      {showEdit && (
        <DocumentModal
          data={data}
          type={'ubah'}
          handleClose={(hasData: boolean) => {
            setShowEdit(false)
            if (hasData) setReFetchDT(true)
          }}
        />
      )}
      {showAdd && (
        <DocumentModal
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
          modalTitle={'Document'}
          title={data?.name}
          id={data?.id}
          url={'user'}
        />
      )}
    </Box>
  )
}

DocumentPage.acl = {
  action: ['create', 'update', 'read', 'delete'],
  subject: 'dokumen'
}

export default DocumentPage
