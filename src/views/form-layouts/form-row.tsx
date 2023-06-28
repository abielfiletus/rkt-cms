import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { SxProps, useTheme } from '@mui/material'
import { jsx } from '@emotion/react'
import JSX = jsx.JSX
import ErrorMessage from '../../@core/components/error-message'

interface IProps {
  id: string
  label: string
  content: JSX.Element
  contentSx?: SxProps<Record<string, any>>
  errors: Record<string, any>
  formikField: string
}

export default function FormRow(props: IProps) {
  const { id, label, content, contentSx, errors, formikField } = props

  const theme = useTheme()

  let errMessage: any = errors
  formikField.split('.').map(item => {
    if (errMessage && errMessage[item]) errMessage = errMessage[item]
    else errMessage = ''
  })

  return (
    <Grid marginTop={3} container>
      <Grid sm={4} item>
        <Box marginTop={2} fontWeight={500} id={id}>
          {label} <span style={{ color: theme.palette.error.main }}>*</span>
        </Box>
      </Grid>
      <Grid sx={contentSx} sm={8} item>
        {content}
        <ErrorMessage fontSize={13} message={typeof errMessage === 'object' ? null : errMessage} />
      </Grid>
    </Grid>
  )
}
