// @ts-nocheck

import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material'
import ReactApexcharts from '../../react-apexcharts'
import { useEffect, useState } from 'react'
import { apiGet } from '../../../../util/api-fetch'
import ChartLoader from '../loader'

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
      <Typography fontSize={12.5} fontWeight={500} color={'black'}>
        Jumlah Pengajuan RKT
      </Typography>
      {isLoading && <ChartLoader />}
      {!isLoading && (
        <ReactApexcharts
          type={'line'}
          height={250}
          series={data?.data}
          options={{
            chart: {
              toolbar: { show: false },
              zoom: false
            },
            legend: {
              position: 'top',
              horizontalAlign: 'left',
              fontSize: '10px',
              markers: { height: '7px', width: '7px' }
            },
            colors: [theme.palette.error.main, theme.palette.warning.main, theme.palette.success.main],
            stroke: {
              width: 2,
              curve: 'smooth',
              lineCap: 'round'
            },
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
            markers: { size: 4, hover: { size: 5 } },
            states: {
              hover: {
                filter: { type: 'none' }
              },
              active: {
                filter: { type: 'none' }
              }
            },
            dataLabels: {
              style: { fontSize: '9px' }
            },
            tooltip: {
              style: { fontSize: '9px' }
            }
          }}
        />
      )}
    </>
  )
}
