import Grid from '@mui/material/Grid'
import { ChartPie } from 'mdi-material-ui'
import { useTheme } from '@mui/material'

interface IProps {
  text: string
  active: boolean
  onClick: any
}

export default function LinkItem(props: IProps) {
  const { active, text, onClick } = props

  const theme = useTheme()

  return (
    <Grid
      columnSpacing={2}
      onClick={onClick}
      sx={{
        '&:after': {
          content: '""',
          float: 'left',
          background: active ? theme.palette.primary.main : 'transparent',
          width: '100%',
          height: '3px',
          borderRadius: '3px'
        },
        cursor: active ? 'default' : 'pointer'
      }}
      container
    >
      <Grid item>
        <ChartPie
          sx={{
            color: active ? theme.palette.primary.main : theme.palette.grey['500'],
            [theme.breakpoints.only('xs')]: { fontSize: 12 }
          }}
        />
      </Grid>
      <Grid
        paddingRight={3}
        marginTop={1}
        color={active ? theme.palette.primary.main : theme.palette.grey['500']}
        fontWeight={500}
        sx={{ [theme.breakpoints.only('xs')]: { fontSize: 12 } }}
        item
      >
        {text}
      </Grid>
    </Grid>
  )
}
