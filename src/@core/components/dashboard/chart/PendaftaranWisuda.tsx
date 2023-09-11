// @ts-nocheck

import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material'
import { apiGet } from '../../../../util/api-fetch'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { ClipboardOutline } from 'mdi-material-ui'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import ReactApexcharts from '../../react-apexcharts'
import useMediaQuery from '@mui/material/useMediaQuery'
import ChartLoader from '../loader'

export default function PendaftaranWisudaChart() {
  const [data, setData] = useState<Record<string, any>>({})
  const [isLoading, setisLoading] = useState<boolean>(true)
  const [total, setTotal] = useState<number>(0)

  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.between(1072, 1172))

  useEffect(() => {
    apiGet('/dashboard/mahasiswa-wisuda').then(async res => {
      setData(res?.data)

      let count = 0
      res?.data?.data?.data?.map((item: number) => {
        count += item
      })

      setTotal(count)

      await new Promise(resolve => setTimeout(resolve, 2000))

      setisLoading(false)
    })
  }, [])

  return (
    <Grid width={isDesktop ? 180 : 190} item>
      <Card sx={{ padding: 3 }} elevation={5}>
        <Grid justifyContent={'space-between'} columnSpacing={5} container>
          <Grid item>
            <Grid columnSpacing={1} container>
              <Grid item>
                <ClipboardOutline fontSize={'8px'} />
              </Grid>
              <Grid item>
                <Typography fontSize={10} marginTop={0.25}>
                  Pendaftaran Wisuda
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography fontWeight={'bold'} fontSize={10}>
              {total}
            </Typography>
          </Grid>
        </Grid>
        <Divider style={{ marginTop: 1, marginBottom: 1 }} />
        {isLoading && <ChartLoader />}
        {!isLoading && (
          <ReactApexcharts
            type={'line'}
            height={150}
            width={isDesktop ? 280 : 180}
            series={[data?.data]}
            options={{
              chart: {
                offsetX: -15,
                parentHeightOffset: 0,
                toolbar: { show: false },
                zoom: false
              },
              legend: { position: 'top', horizontalAlign: 'left' },
              colors: [theme.palette.success.main],
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
                  style: { colors: theme.palette.primary.main, fontSize: 8 }
                },
                offsetY: -8,
                tooltip: { enabled: false }
              },
              yaxis: {
                labels: {
                  formatter: (value: number) => Math.round(value) + '',
                  style: { fontSize: 8 }
                }
              },
              states: {
                hover: {
                  filter: { type: 'none' }
                },
                active: {
                  filter: { type: 'none' }
                }
              },
              tooltip: {
                style: { fontSize: '8px' }
              }
            }}
          />
        )}
      </Card>
    </Grid>
  )
}
