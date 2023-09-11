// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import { SvgIconProps, useTheme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'

interface UserIconProps {
  iconProps?: SvgIconProps
  icon: string | ReactNode
}

const UserIcon = (props: UserIconProps) => {
  // ** Props
  const { icon, iconProps } = props

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'))

  const IconTag = icon

  // const styles = {
  //   color: 'red',
  //   fontSize: '2rem'
  // }

  // @ts-ignore
  return <IconTag {...iconProps} fontSize={isMobile ? 'small' : '12px'} />
}

export default UserIcon
