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
  boxSx?: SxProps<Record<string, any>>
  boxGrid?: number
  contentGrid?: number
  errors: Record<string, any>
  formikField: string
  alignLabel?: 'start' | 'end' | 'center'
}

export default function FormRow(props: IProps) {
  const { id, label, content, contentSx, errors, formikField, boxSx, boxGrid, contentGrid, alignLabel } = props

  const theme = useTheme()

  let errMessage: any = errors
  formikField.split('.').map(item => {
    if (errMessage && errMessage[item]) errMessage = errMessage[item]
    else errMessage = ''
  })

  return (
    <Grid marginTop={2} columnSpacing={2} alignItems={alignLabel || 'end'} container>
      <Grid xs={boxGrid || 4} item>
        <Box marginTop={0.7} fontWeight={500} id={id} sx={boxSx}>
          {label} <span style={{ color: theme.palette.error.main }}>*</span>
        </Box>
      </Grid>
      <Grid sx={contentSx} xs={contentGrid || 8} item>
        {content}
        <ErrorMessage sx={contentSx} fontSize={13} message={typeof errMessage === 'object' ? null : errMessage} />
      </Grid>
    </Grid>
  )
}
