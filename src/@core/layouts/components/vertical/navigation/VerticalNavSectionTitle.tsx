// ** MUI Imports
import Divider from '@mui/material/Divider'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import MuiListSubheader, { ListSubheaderProps } from '@mui/material/ListSubheader'

// ** Types
import { NavSectionTitle } from '../../../types'
import CanViewNavSectionTitle from '../../acl/CanViewNavSectionTitle'
import { Settings } from '../../../../context/settingsContext'
import useMediaQuery from '@mui/material/useMediaQuery'

interface Props {
  navHover: boolean
  settings: Settings
  item: NavSectionTitle
  collapsedNavWidth: number
  navigationBorderWidth: number
}

// ** Styled Components
const ListSubheader = styled((props: ListSubheaderProps) => <MuiListSubheader component='li' {...props} />)(({ theme }) => ({
  lineHeight: 1,
  display: 'flex',
  position: 'relative',
  marginTop: theme.spacing(7),
  marginBottom: theme.spacing(2),
  backgroundColor: 'transparent',
  transition: 'padding-left .25s ease-in-out'
}))

const TypographyHeaderText = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: '0.75rem',
  lineHeight: 'normal',
  letterSpacing: '0.21px',
  textTransform: 'uppercase',
  color: theme.palette.text.disabled,
  fontWeight: theme.typography.fontWeightMedium
}))

const VerticalNavSectionTitle = (props: Props) => {
  // ** Props
  const { item, navHover, settings, collapsedNavWidth, navigationBorderWidth } = props

  // ** Hook
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'))

  // ** Vars
  const { navCollapsed } = settings

  const conditionalColors = () => {
    return {
      '& .MuiTypography-root': {
        color: 'text.disabled'
      },
      '& .MuiDivider-root:before, & .MuiDivider-root:after, & hr': {
        borderColor: `rgba(${theme.palette.customColors.main}, ${navCollapsed && !navHover ? 0.3 : 0.12})`
      }
    }
  }

  return (
    <CanViewNavSectionTitle navTitle={item}>
      <ListSubheader
        className='nav-section-title'
        sx={{
          marginTop: isMobile ? 0 : undefined,
          ...conditionalColors(),
          ...(navCollapsed && !navHover
            ? {
                py: 3.5,
                pr: (collapsedNavWidth - navigationBorderWidth - 24) / 8 - 1,
                pl: (collapsedNavWidth - navigationBorderWidth - 24) / 8 + 0.25
              }
            : { px: 0, py: 1.75 })
        }}
      >
        <Divider
          textAlign='left'
          sx={{
            m: 0,
            lineHeight: 'normal',
            ...(navCollapsed && !navHover
              ? { width: 22 }
              : {
                  width: '100%',
                  textTransform: 'uppercase',
                  '&:before, &:after': { top: 7, transform: 'none' },
                  '& .MuiDivider-wrapper': { px: 2.5, fontSize: '0.75rem', letterSpacing: '0.21px' }
                })
          }}
        >
          {navCollapsed && !navHover ? null : <TypographyHeaderText noWrap>{item.sectionTitle}</TypographyHeaderText>}
        </Divider>
      </ListSubheader>
    </CanViewNavSectionTitle>
  )
}

export default VerticalNavSectionTitle
