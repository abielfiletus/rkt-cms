import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material'

interface IProps {
  message: string
  pl?: string
  pt?: string
  fontSize?: number
}

export default function ErrorMessage(props: IProps) {
  const { message, pl, pt, fontSize } = props

  const theme = useTheme()

  return message ? (
    <Typography variant={'body2'} pl={pl} pt={pt} color={theme.palette.error.main} fontSize={fontSize}>
      {message}
    </Typography>
  ) : (
    <div></div>
  )
}
