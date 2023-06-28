import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material'
import TableStickyHeader from '../../views/tables/TableStickyHeader'
import { PlusCircleOutline } from 'mdi-material-ui'
import UserModal from '../../@core/components/user/modal'
import { useContext, useState } from 'react'
import DeleteModal from '../../@core/components/modal/delete'
import { AbilityContext } from '../../@core/layouts/components/acl/Can'

const UserPage = () => {
  const theme = useTheme()
  const ability = useContext(AbilityContext)

  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [showAdd, setShowAdd] = useState<boolean>(false)
  const [showDelete, setShowDelete] = useState<boolean>(false)
  const [data, setData] = useState<Record<string, any>>({})
  const [reFetchDT, setReFetchDT] = useState<boolean>(false)
  const [initializedDT, setInitializedDT] = useState<boolean>(false)

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

  return (
    <Box>
      <Typography variant={'h6'} fontWeight={'bold'}>
        Data User
      </Typography>
      <Box textAlign={'right'} mt={3}>
        {ability.can('create', 'user') && (
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
                  Tambah User
                </Typography>
              </Grid>
            </Grid>
          </Button>
        )}
      </Box>
      <Box mt={10}>
        <TableStickyHeader
          columns={[
            { id: 'id', label: 'ID User' },
            { id: 'name', label: 'Name' },
            { id: 'email', label: 'Email' },
            { id: 'department.name', label: 'Bagian' },
            { id: 'role.name', label: 'Akses' },
            {
              id: 'action',
              label: 'Aksi',
              content: { edit: ability.can('update', 'user'), delete: ability.can('delete', 'user') }
            }
          ]}
          url={'user'}
          queryParams={{ join: 'all' }}
          handleRowClick={handleRowClick}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          reFetch={reFetchDT}
          setReFetch={setReFetchDT}
          initialized={initializedDT}
          setInitialized={setInitializedDT}
        />
      </Box>
      {showDetail && <UserModal data={data} type={'detail'} handleClose={() => setShowDetail(false)} />}
      {showEdit && (
        <UserModal
          data={data}
          type={'ubah'}
          handleClose={(hasData: boolean) => {
            setShowEdit(false)
            if (hasData) setReFetchDT(true)
          }}
        />
      )}
      {showAdd && (
        <UserModal
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
          modalTitle={'User'}
          title={data?.name}
          id={data?.id}
          url={'user'}
        />
      )}
    </Box>
  )
}

UserPage.acl = {
  action: ['create', 'update', 'read', 'delete'],
  subject: 'user'
}

export default UserPage
