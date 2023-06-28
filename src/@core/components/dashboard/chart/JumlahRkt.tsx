// @ts-nocheck

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { CircularProgress, useTheme } from '@mui/material'
import ReactApexcharts from '../../react-apexcharts'
import { useEffect, useState } from 'react'
import { apiGet } from '../../../../util/api-fetch'

export default function JumlahRktChart() {
  const [data, setData] = useState<Record<string, any>>({})
  const [isLoading, setisLoading] = useState(true)

  const theme = useTheme()

  useEffect(() => {
    apiGet('/dashboard/total-rkt').then(async res => {
      setData(res.data)

      await new Promise(resolve => setTimeout(resolve, 2000))

      setisLoading(false)
    })
  }, [])

  return (
    <>
      <Typography fontSize={17} fontWeight={500} color={'black'}>
        Jumlah Pengajuan RKT
      </Typography>
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
          type={'line'}
          height={400}
          series={data?.data}
          options={{
            chart: {
              parentHeightOffset: 0,
              toolbar: { show: false },
              zoom: false
            },
            legend: { position: 'top', horizontalAlign: 'left' },
            colors: [theme.palette.error.main, theme.palette.warning.main, theme.palette.success.main],
            stroke: {
              width: 3,
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
            markers: { size: 5 },
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
