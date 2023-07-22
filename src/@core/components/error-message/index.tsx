import Typography from '@mui/material/Typography'
import { SxProps, useTheme } from '@mui/material'

interface IProps {
  message: string
  pl?: string
  pt?: string
  fontSize?: number
  sx?: SxProps<Record<string, any>>
}

export default function ErrorMessage(props: IProps) {
  const { message, pl, pt, fontSize, sx } = props

  const theme = useTheme()

  return message ? (
    <Typography variant={'body2'} pl={pl} pt={pt} color={theme.palette.error.main} fontSize={fontSize} sx={sx}>
      {message}
    </Typography>
  ) : (
    <div></div>
  )
}
