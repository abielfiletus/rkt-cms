// ** React Imports
import { useState, ChangeEvent, useMemo } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import { apiGet } from '../../util/api-fetch'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import { DeleteOutline, PencilOutline } from 'mdi-material-ui'
import { SxProps } from '@mui/material'
import { Theme } from '@mui/material/styles'

interface ColumnActionValues {
  conditional: Array<{ key: string; value: string | number; conjunction?: string }>
}

interface ColumnContent {
  edit: boolean | ColumnActionValues
  delete: boolean | ColumnActionValues
}

interface Column {
  id: string
  label: string
  minWidth?: number
  labelAlign?: 'right' | 'center' | 'left'
  align?: 'right' | 'center' | 'left'
  format?: (value: number) => string
  fontSize?: number
  iconSize?: 'inherit' | 'small' | 'medium' | 'large'
  content?: ColumnContent
  transform?: (value: string | number | boolean) => any
}

interface IProps {
  columns: Column[]
  url: string
  queryParams?: Record<string, any>
  handleRowClick?: (data: Record<string, any>) => void
  handleEditClick?: (data: Record<string, any>) => void
  handleDeleteClick?: (data: Record<string, any>) => void
  reFetch: boolean
  setReFetch: (data: boolean) => void
  initialized: boolean
  setInitialized: (data: boolean) => void
  sx?: SxProps<Theme>
  paginationFontSize?: number
}

const TableStickyHeader = (props: IProps) => {
  const {
    url,
    queryParams,
    columns,
    handleRowClick,
    handleEditClick,
    handleDeleteClick,
    reFetch,
    setReFetch,
    setInitialized,
    initialized,
    sx,
    paginationFontSize
  } = props

  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [data, setData] = useState<Array<Record<string, any>>>([])
  const [loadingDT, setLoadingDT] = useState<boolean>(true)
  const [count, setCount] = useState<number>(0)

  const baseUrl = '/' + url

  useMemo(() => {
    if (!initialized || reFetch) {
      let reqUrl = baseUrl
      if (queryParams) reqUrl += '?' + new URLSearchParams(queryParams)

      apiGet(reqUrl).then(res => {
        setData(res?.data?.data)
        setCount(res?.data?.recordsFiltered)
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
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden', ...sx }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {columns?.map(column => (
                  <TableCell
                    key={column.label}
                    align={column.labelAlign}
                    sx={{
                      minWidth: column.minWidth,
                      fontSize: column.fontSize + 'px !important',
                      lineHeight: '1rem',
                      paddingTop: 3,
                      paddingBottom: 3
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
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
                      sx={{ cursor: handleRowClick ? 'pointer' : 'inherit', fontSize: item.fontSize }}
                    >
                      {columns?.map(column => {
                        const split = column.id.split('.') as string[]
                        let value = ''

                        for (const [i, key] of split.entries()) {
                          if (value) {
                            // @ts-ignore
                            value = value[key]
                          } else {
                            if (!value && i > 0) break
                            value = item[key]
                          }
                        }

                        value = value || '-'

                        if (column.transform) value = column.transform(value)

                        keyValues[column.id] = value

                        let showEdit = false
                        let showDelete = false
                        if (column.id === 'action') {
                          showEdit = validateShowActionButton(column.content?.edit, keyValues)
                          showDelete = validateShowActionButton(column.content?.delete, keyValues)
                        }

                        return column.id === 'action' ? (
                          <TableCell key={'table-' + item.id + '-' + column.label} align={column.align}>
                            <Grid container>
                              {showEdit && (
                                <Grid item>
                                  <IconButton onClick={() => (handleEditClick ? handleEditClick(item) : null)}>
                                    <PencilOutline color={'primary'} fontSize={column.iconSize} />
                                  </IconButton>
                                </Grid>
                              )}
                              {showDelete && (
                                <Grid item>
                                  <IconButton onClick={() => (handleDeleteClick ? handleDeleteClick(item) : null)}>
                                    <DeleteOutline color={'error'} fontSize={column.iconSize} />
                                  </IconButton>
                                </Grid>
                              )}
                              {!showDelete && !showEdit && '-'}
                            </Grid>
                          </TableCell>
                        ) : (
                          <TableCell
                            key={'table-' + item.id + '-' + column.label}
                            align={column.align}
                            onClick={handleRowClick ? () => handleRowClick(item) : undefined}
                            style={{ paddingTop: 3, paddingBottom: 3 }}
                            sx={{ fontSize: column.fontSize }}
                          >
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : column.id === 'action'
                              ? column.content
                              : value}
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
    </>
  )
}

export default TableStickyHeader
