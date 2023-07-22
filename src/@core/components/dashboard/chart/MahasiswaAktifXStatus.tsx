// @ts-nocheck

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { CircularProgress, Select, useTheme } from '@mui/material'
import ReactApexcharts from '../../react-apexcharts'
import { useEffect, useMemo, useState } from 'react'
import { apiGet } from '../../../../util/api-fetch'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'

export default function MahasiswaAktifXStatusChart() {
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
    apiGet('/dashboard/mahasiswa-aktif-prodi/' + selectedYear).then(async res => {
      setData(res.data)

      await new Promise(resolve => setTimeout(resolve, 2000))

      setIsLoading(false)
    })
  }, [selectedYear])

  return (
    <>
      <Grid columnSpacing={3} container>
        <Grid item>
          <Typography fontSize={17} fontWeight={500} color={'black'}>
            Mahasiswa Aktif Prodi vs Status
          </Typography>
        </Grid>
        <Grid marginTop={isMobile ? 3 : 0} item>
          <FormControl>
            <InputLabel id='status-year'>Tahun</InputLabel>
            <Select
              value={selectedYear}
              label={'Tahun'}
              labelId={'status-year'}
              size={'small'}
              sx={{ fontSize: 13 }}
              onChange={event => {
                setIsLoading(true)
                setSelectedYear(event.target.value)
              }}
            >
              {selectOption.map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {isLoading && (
        <Grid justifyContent={'center'} marginTop={3} columnSpacing={2} container>
          <Grid item>
            <CircularProgress size={15} />
          </Grid>
          <Grid item>
            <Typography pt={0.25} fontSize={14}>
              Memuat Data...
            </Typography>
          </Grid>
        </Grid>
      )}
      {!isLoading && (
        <ReactApexcharts
          type={'bar'}
          height={400}
          series={data?.data}
          options={{
            chart: {
              stacked: true,
              parentHeightOffset: 0,
              toolbar: { show: false },
              zoom: false
            },
            legend: { position: 'top', horizontalAlign: 'left' },
            colors: [
              theme.palette.success.main,
              theme.palette.error.main,
              theme.palette.warning.main,
              theme.palette.secondary.main
            ],
            stroke: {
              width: 1,
              curve: 'smooth',
              lineCap: 'round'
            },
            xaxis: {
              axisTicks: { show: false },
              axisBorder: { show: false },
              categories: data?.legends,
              labels: {
                style: { colors: theme.palette.text.disabled }
              }
            },
            yaxis: {
              labels: {
                formatter: (value: number) => Math.round(value) + ''
              }
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
