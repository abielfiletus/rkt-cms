// @ts-nocheck

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { Select, useTheme } from '@mui/material'
import ReactApexcharts from '../../react-apexcharts'
import { useEffect, useMemo, useState } from 'react'
import { apiGet } from '../../../../util/api-fetch'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import ChartLoader from '../loader'

export default function RktBasedCapaianChart() {
  const [data, setData] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectOption, setSelectOption] = useState<Array<number>>([])

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'))

  useEffect(() => {
    const year = new Date().getFullYear()
    const opts = []

    for (let i = year - 4; i <= year; i++) {
      opts.push(i)
    }

    setSelectOption(opts)
  }, [])

  useMemo(() => {
    apiGet('/dashboard/rkt-by-capaian/' + selectedYear).then(async res => {
      setData(res.data)

      await new Promise(resolve => setTimeout(resolve, 2000))

      setIsLoading(false)
    })
  }, [selectedYear])

  return (
    <>
      <Grid columnSpacing={3} container>
        <Grid item>
          <Typography fontSize={12.5} fontWeight={500} color={'black'}>
            RKT Berdasarkan Status Capaian
          </Typography>
        </Grid>
        <Grid marginTop={isMobile ? 3 : 0} item>
          <FormControl>
            <InputLabel id='status-year' sx={{ fontSize: 11, paddingTop: 1 }}>
              Tahun
            </InputLabel>
            <Select
              value={selectedYear}
              label={'Tahun'}
              labelId={'status-year'}
              size={'small'}
              sx={{ fontSize: 10 }}
              onChange={event => {
                setIsLoading(true)
                setSelectedYear(event.target.value)
              }}
            >
              {selectOption.map(year => (
                <MenuItem sx={{ fontSize: 10, paddingTop: 1, paddingBottom: 1 }} key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {isLoading && <ChartLoader />}
      {!isLoading && (
        <ReactApexcharts
          type={'bar'}
          height={250}
          series={data?.data}
          options={{
            chart: {
              stacked: true,
              parentHeightOffset: 0,
              toolbar: { show: false },
              zoom: false
            },
            legend: {
              position: 'top',
              horizontalAlign: 'left',
              fontSize: '10px',
              markers: { height: '7px', width: '7px' }
            },
            stroke: {
              width: 1,
              curve: 'smooth',
              lineCap: 'round'
            },
            dataLabels: {
              style: { fontSize: '9px' }
            },
            colors: [
              theme.palette.error.main,
              theme.palette.warning.main,
              theme.palette.secondary.main,
              theme.palette.success.main
            ],
            xaxis: {
              axisTicks: { show: false },
              axisBorder: { show: false },
              categories: data?.legends,
              labels: {
                style: { colors: theme.palette.text.disabled, fontSize: 9 }
              },
              tooltip: { enabled: false }
            },
            yaxis: {
              labels: {
                formatter: (value: number) => Math.round(value) + '',
                style: { fontSize: 9 }
              }
            },
            tooltip: {
              style: { fontSize: '9px' }
            },
            states: {
              hover: {
                filter: { type: 'none' }
              },
              active: {
                filter: { type: 'none' }
              }
            }
          }}
        />
      )}
    </>
  )
}
