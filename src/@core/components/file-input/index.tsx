import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import ErrorMessage from '../error-message'
import { SxProps, useTheme } from '@mui/material'

interface IProps {
  name: string
  error: string | boolean | undefined
  showErrorMessage?: boolean
  handleChange: (event: any) => void
  disabled: boolean
  errorMessage: string
  value: string
  mimeAccept?: string
  paddingTopError?: string
  width?: number
  height?: number
  url?: string
  sx?: SxProps
}

export default function FileInput(props: IProps) {
  const {
    name,
    error,
    handleChange,
    disabled,
    errorMessage,
    value,
    mimeAccept,
    paddingTopError,
    width,
    height,
    showErrorMessage,
    url,
    sx
  } = props

  const theme = useTheme()

  const handleView = () => {
    window.open(url, '_blank')
  }

  return (
    <>
      <label htmlFor={name} onClick={disabled ? handleView : undefined}>
        <Box position={'relative'}>
          <input
            type={'file'}
            id={name}
            accept={mimeAccept || '.jpg, .jpeg, .png'}
            name={name}
            onChange={handleChange}
            disabled={disabled}
            hidden
          />
          {value && (
            <Avatar
              src={value}
              sx={{
                height: height || 150,
                width: width || 150,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 5,
                boxShadow: theme.shadows[4],
                cursor: 'pointer',
                border: error ? '1px solid red' : null,
                borderRadius: 1,
                ...sx
              }}
            />
          )}
          {!value && (
            <Box
              width={width || 150}
              height={height || 150}
              border={error ? '1px solid red' : `1px solid ${theme.palette.grey.A100}`}
              marginLeft={'auto'}
              marginRight={'auto'}
              marginTop={'1.25rem'}
              borderRadius={1}
              boxShadow={theme.shadows['3']}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              sx={{ cursor: 'pointer', ...sx }}
              className={'input_file'}
            >
              <Box textAlign={'center'}>
                <img src='/images/upload.png' alt='upload' style={{ objectFit: 'contain', width: '30px' }} />
                <p style={{ marginTop: 0, marginBottom: 0, fontSize: 10, width: '100%' }}>Upload</p>
              </Box>
            </Box>
          )}
        </Box>
      </label>
      {error && (showErrorMessage === true || showErrorMessage === undefined) && (
        <ErrorMessage pt={paddingTopError} message={errorMessage} />
      )}
    </>
  )
}
