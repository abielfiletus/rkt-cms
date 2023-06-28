import { useContext, useEffect, useState } from 'react'
import { apiGet, apiPatch } from '../../util/api-fetch'
import LoaderPage from '../../views/loader'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import { CircularProgress, Switch } from '@mui/material'
import { AbilityContext } from '../../@core/layouts/components/acl/Can'

const PengaturanPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasPermission, setHasPermission] = useState<boolean>(false)
  const [data, setData] = useState<Array<Record<string, any>>>([])

  const ability = useContext(AbilityContext)

  useEffect(() => {
    apiGet('/config').then(res => {
      res.data?.data?.forEach((item: Record<string, any>) => {
        item.isLoading = false
      })
      setData(res.data?.data)
      setIsLoading(false)

      if (ability.can('create', 'pengaturan') || ability.can('update', 'pengaturan')) {
        setHasPermission(true)
      }
    })
  }, [])

  const handleClickSlider = async (index: number) => {
    const item = data[index]
    item.isLoading = true
    item.status = !item.status

    let newData = JSON.parse(JSON.stringify(data))
    newData[index] = item
    setData(newData)

    await apiPatch('/config/' + item.id, { status: item.status })

    newData = JSON.parse(JSON.stringify(newData))
    item.isLoading = false
    newData[index] = item
    setData(newData)
  }

  return (
    <>
      {isLoading && <LoaderPage />}
      {!isLoading && (
        <Box>
          <Typography variant={'h6'} fontWeight={'bold'} color={'primary'}>
            Peraturan Open / Closed
          </Typography>
          <Box marginTop={10} paddingLeft={10}>
            {data.map((item, i) => (
              <Box key={i} marginY={3}>
                <FormControlLabel
                  value='required'
                  label={item.name}
                  onChange={() => handleClickSlider(i)}
                  control={<Switch />}
                  checked={item.status}
                  disabled={item.isLoading || !hasPermission}
                />
                {item.isLoading && <CircularProgress size={20} />}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </>
  )
}

PengaturanPage.acl = {
  action: ['create', 'read', 'update', 'read'],
  subject: 'pengaturan'
}

export default PengaturanPage
