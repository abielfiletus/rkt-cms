import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import { DeleteOutline, FileEyeOutline, PencilOutline } from 'mdi-material-ui'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import { ChangeEvent, useEffect, useState } from 'react'
import { apiGet } from '../../util/api-fetch'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material'

interface ColumnActionValues {
  conditional: Array<{ key: string; value: string | number; conjunction?: string }>
}

interface ColumnContent {
  edit?: boolean | ColumnActionValues
  delete?: boolean | ColumnActionValues
  detail?: boolean | ColumnActionValues
}

export interface Column {
  id: string
  label: string
  additionalId?: string
  labelFromDataField?: string
  minWidth?: number
  maxWidth?: number
  align?: 'right' | 'center' | 'left'
  format?: (value: number) => string
  content?: ColumnContent
  transform?: (value: string | number | boolean, data: Record<string, any>) => any
  isBadge?: boolean
  badgeColor?: (value: string | number) => 'primary' | 'secondary' | 'info' | 'warning' | 'success' | 'error'
  badgeOnClick?: (data: Record<string, any>) => any
  noWrap?: boolean
  fontSize?: number
  iconSize?: 'small' | 'medium' | 'large' | 'inherit'
}

interface IProps {
  columns: Column[]
  url: string
  queryParams?: Record<string, any>
  handleRowClick?: (data: Record<string, any>) => void
  handleDetailClick?: (data: Record<string, any>) => void
  handleEditClick?: (data: Record<string, any>) => void
  handleDeleteClick?: (data: Record<string, any>) => void
  customIcon?: (data: Record<string, any>) => JSX.Element
  customIconDetail?: JSX.Element
  customActionIcon?: JSX.Element
  initialized: boolean
  reFetch: boolean
  setReFetch: (data: boolean) => void
  setInitialized: (data: boolean) => void
  paginationFontSize?: number
}

const valueFromFlattenArray = (keys: Array<string>, data: Record<string, any>) => {
  let value = ''
  for (const [i, key] of keys.entries()) {
    if (value) {
      // @ts-ignore
      value = value[key]
    } else {
      if (!value && i > 0) break
      value = data[key]
    }
  }

  return value
}

const CustomTable = (props: IProps) => {
  const {
    url,
    queryParams,
    columns,
    handleRowClick,
    handleEditClick,
    handleDeleteClick,
    handleDetailClick,
    customIconDetail,
    customIcon,
    reFetch,
    setReFetch,
    setInitialized,
    initialized,
    paginationFontSize
  } = props

  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [data, setData] = useState<Array<Record<string, any>>>([])
  const [loadingDT, setLoadingDT] = useState<boolean>(true)
  const [count, setCount] = useState<number>(0)

  const theme = useTheme()

  const baseUrl = '/' + url

  useEffect(() => {
    if (!initialized || reFetch) {
      let reqUrl = baseUrl
      if (queryParams) reqUrl += '?' + new URLSearchParams(queryParams)

      apiGet(reqUrl).then(res => {
        setData(res?.data?.data)
        setCount(res?.data?.recordsFiltered || 0)
        setLoadingDT(false)
      })

      if (reFetch) setReFetch(false)
      if (!initialized) setInitialized(true)
    }
  }, [page, rowsPerPage, reFetch, initialized])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const validateShowActionButton = (columnContent: boolean | ColumnActionValues | undefined, rowValues: Record<string, any>) => {
    let show = false

    if (columnContent) show = true

    if (typeof columnContent === 'object' && columnContent.conditional) {
      const res: string[] = []
      columnContent.conditional.map(logic => {
        const rowValue = `"${rowValues[logic.key]}"`
        const expectedValue = `"${logic.value}"`
        const conjunction = logic.conjunction || '=='

        res.push(eval(rowValue + conjunction + expectedValue))
      })

      show = eval(res.join('&&'))
    }

    return show
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table>
          <TableBody>
            {loadingDT && (
              <TableRow>
                <TableCell align={'center'} colSpan={columns.length}>
                  <Typography fontStyle={'italic'} variant={'caption'} textAlign={'center'}>
                    Memuat Data
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!data?.length && !loadingDT && (
              <TableRow>
                <TableCell align={'center'} colSpan={columns.length}>
                  <Typography fontStyle={'italic'} variant={'caption'} textAlign={'center'}>
                    Tidak ada data
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loadingDT &&
              data?.map((item, i) => {
                const keyValues: Record<string, any> = {}

                return (
                  <TableRow
                    hover
                    role='checkbox'
                    tabIndex={-1}
                    key={'row-' + i}
                    sx={{ cursor: handleRowClick ? 'pointer' : 'inherit' }}
                  >
                    {columns?.map(column => {
                      const split = column.id.split('.') as string[]
                      let value: JSX.Element | string = valueFromFlattenArray(split, item)

                      value = value || '-'

                      const beforeTransform = value
                      if (column.transform) {
                        value = column.transform(value as string, item)
                      }

                      if (column.isBadge) {
                        const badgeColor = column.badgeColor ? column.badgeColor(beforeTransform as string) : 'primary'
                        value = (
                          <Box
                            borderRadius={40}
                            bgcolor={theme.palette[badgeColor].main}
                            color={'white'}
                            textAlign={'center'}
                            paddingX={5}
                            paddingY={2}
                            fontWeight={600}
                            fontSize={column.fontSize || 12}
                            onClick={() => (column.badgeOnClick ? column.badgeOnClick(item) : null)}
                            sx={{
                              '&:hover': {
                                cursor: column.badgeOnClick ? 'pointer' : 'inherit'
                              }
                            }}
                          >
                            {value}
                          </Box>
                        )
                      }

                      keyValues[column.id] = value

                      let showEdit = false
                      let showDelete = false
                      let showDetail = false
                      if (column.id === 'action') {
                        showEdit = validateShowActionButton(column.content?.edit, keyValues)
                        showDelete = validateShowActionButton(column.content?.delete, keyValues)
                        showDetail = validateShowActionButton(column.content?.detail, keyValues)
                      }

                      let label = (
                        <Typography fontSize={column.fontSize || 13} fontWeight={600} color={theme.palette.grey[600]}>
                          {column.label}
                        </Typography>
                      )

                      if (column.labelFromDataField) {
                        label = (
                          <Typography fontSize={column.fontSize || 13} color={'primary'} fontWeight={600}>
                            #{valueFromFlattenArray(column.labelFromDataField.split('.') as Array<string>, item)}
                          </Typography>
                        )
                      }

                      return column.id === 'action' ? (
                        <TableCell key={'table-' + item.id + '-' + column.label} align={column.align}>
                          {customIcon && (
                            <Box sx={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}>{customIcon(item)}</Box>
                          )}
                          {!customIcon && (
                            <Grid container>
                              {showDetail && handleDetailClick && (
                                <Grid item>
                                  <IconButton onClick={() => (handleDetailClick ? handleDetailClick(item) : null)}>
                                    {customIconDetail}
                                    {!customIconDetail && <FileEyeOutline color={'success'} fontSize={column.iconSize} />}
                                  </IconButton>
                                </Grid>
                              )}
                              {showEdit && handleEditClick && (
                                <Grid item>
                                  <IconButton onClick={() => (handleEditClick ? handleEditClick(item) : null)}>
                                    <PencilOutline color={'primary'} fontSize={column.iconSize} />
                                  </IconButton>
                                </Grid>
                              )}
                              {showDelete && handleDeleteClick && (
                                <Grid item>
                                  <IconButton onClick={() => (handleDeleteClick ? handleDeleteClick(item) : null)}>
                                    <DeleteOutline color={'error'} fontSize={column.iconSize} />
                                  </IconButton>
                                </Grid>
                              )}
                              {!showDelete && !showEdit && !showDetail && '-'}
                            </Grid>
                          )}
                        </TableCell>
                      ) : (
                        <TableCell
                          key={'table-' + item.id + '-' + column.label}
                          align={column.align}
                          onClick={handleRowClick ? () => handleRowClick(item) : undefined}
                          sx={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
                        >
                          {!column.isBadge && label}
                          {column.isBadge && value}
                          {!column.isBadge && (
                            <Typography fontSize={column.fontSize || 13} color={'black'} fontWeight={500} noWrap={column.noWrap}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : column.id === 'action'
                                ? column.content
                                : value}
                            </Typography>
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '& p': { fontSize: paginationFontSize ? `${paginationFontSize}px !important` : 'inherit' },
          '& div': { fontSize: paginationFontSize ? `${paginationFontSize}px !important` : 'inherit' }
        }}
      />
    </Paper>
  )
}

export default CustomTable
