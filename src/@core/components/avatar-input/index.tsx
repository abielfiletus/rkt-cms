import Box from '@mui/material/Box'
import { PencilOutline } from 'mdi-material-ui'
import Avatar from '@mui/material/Avatar'
import ErrorMessage from '../error-message'
import { useTheme } from '@mui/material'

interface IProps {
  name: string
  error: string | false | undefined
  handleChange: (event: any) => void
  disabled: boolean
  errorMessage: string
  value: string
  height?: number
  width?: number
}

export default function AvatarInput(props: IProps) {
  const { name, error, handleChange, disabled, errorMessage, value, height, width } = props

  const theme = useTheme()

  return (
    <>
      <label htmlFor={name}>
        <Box
          position={'relative'}
          sx={{
            cursor: 'pointer',
            border: error ? '1px solid red' : null
          }}
        >
          <input
            type={'file'}
            id={name}
            accept={'.jpg, .jpeg, .png'}
            name={name}
            onChange={handleChange}
            disabled={disabled}
            hidden
          />
          <Box
            position={'absolute'}
            sx={{
              background: 'rgba(0, 0, 0, 0.37);',
              borderRadius: '50%',
              left: '50%',
              top: '50%',
              width: 40,
              height: 40,
              transform: 'translate(-50%, -50%)',
              paddingTop: 2,
              paddingLeft: 2,
              zIndex: 1000
            }}
          >
            <PencilOutline sx={{ color: 'white' }} />
          </Box>
          <Avatar
            src={value}
            sx={{
              height: height || 200,
              width: width || 200,
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 5,
              boxShadow: theme.shadows[7]
            }}
          />
        </Box>
      </label>
      {error && <ErrorMessage message={errorMessage} />}
    </>
  )
}
