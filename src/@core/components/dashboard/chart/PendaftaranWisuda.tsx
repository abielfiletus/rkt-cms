// @ts-nocheck

import { useEffect, useState } from 'react'
import { CircularProgress, useTheme } from '@mui/material'
import { apiGet } from '../../../../util/api-fetch'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { ClipboardOutline } from 'mdi-material-ui'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import ReactApexcharts from '../../react-apexcharts'
import useMediaQuery from '@mui/material/useMediaQuery'

export default function PendaftaranWisudaChart() {
  const [data, setData] = useState<Record<string, any>>({})
  const [isLoading, setisLoading] = useState<boolean>(true)
  const [total, setTotal] = useState<number>(0)

  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.between(894, 1072))

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
    <Grid width={isDesktop ? 330 : 250} item>
      <Card sx={{ padding: 3 }} elevation={5}>
        <Grid justifyContent={'space-between'} columnSpacing={10} container>
          <Grid item>
            <Grid columnSpacing={2} container>
              <Grid item>
                <ClipboardOutline fontSize={'small'} />
              </Grid>
              <Grid item>
                <Typography fontSize={13} marginTop={0.25}>
                  Pendaftaran Wisuda
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography fontWeight={'bold'} fontSize={13}>
              {total}
            </Typography>
          </Grid>
        </Grid>
        <Divider />
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
            height={170}
            width={isDesktop ? 300 : 220}
            series={[data?.data]}
            options={{
              chart: {
                parentHeightOffset: 0,
                toolbar: { show: false },
                zoom: false
              },
              legend: { position: 'top', horizontalAlign: 'left' },
              colors: [theme.palette.success.main],
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
                  style: { colors: theme.palette.text.primary }
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
      </Card>
    </Grid>
  )
}
