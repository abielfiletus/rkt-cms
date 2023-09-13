import InputLabel from '@mui/material/InputLabel'

interface IProps {
  id: string
  label: string
}

export default function CustomInputLabel(props: IProps) {
  const { label, id } = props

  return (
    <InputLabel
      id={id}
      sx={{
        fontSize: 12,
        top: '-8px',
        '&.MuiInputLabel-shrink': { top: '3px' }
      }}
    >
      {label}
    </InputLabel>
  )
}
