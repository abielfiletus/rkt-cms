// ** React Imports
import { ElementType, ReactNode } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton'

// ** Configs Import
import themeConfig from '../../../../../configs/themeConfig'

// ** Types
import { Settings } from '../../../../context/settingsContext'

// ** Custom Components Imports
import UserIcon from '../../../../../layouts/components/UserIcon'

// ** Utils
import { handleURLQueries } from '../../../utils'
import CanViewNavLink from '../../acl/CanViewNavLink'
import { NavLink } from '../../../../../layouts/types'
import { useTheme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'

interface Props {
  item: NavLink
  settings: Settings
  navVisible?: boolean
  toggleNavVisibility: () => void
}

// ** Styled Components
const MenuNavLink = styled(ListItemButton)<ListItemButtonProps & { component?: ElementType; target?: '_blank' | undefined }>(
  ({ theme }) => ({
    width: '100%',
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    color: theme.palette.text.primary,
    padding: theme.spacing(2.25, 3.5),
    transition: 'opacity .25s ease-in-out',
    '&.active, &.active:hover': {
      boxShadow: theme.shadows[3],
      backgroundImage: `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.main} 94%)`
    },
    '&.active .MuiTypography-root, &.active .MuiSvgIcon-root': {
      color: `${theme.palette.common.white} !important`
    }
  })
)

const MenuItemTextMetaWrapper = styled(Box)<BoxProps>({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
})

const VerticalNavLink = ({ item, navVisible, toggleNavVisibility }: Props) => {
  // ** Hooks
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'))

  const IconTag: ReactNode = item.icon

  const isNavLinkActive = () => router.pathname === item.path || handleURLQueries(router, item.path)

  return (
    <CanViewNavLink navLink={item}>
      <ListItem disablePadding className='nav-link' disabled={item.disabled || false} sx={{ mt: 1.5, px: '0 !important' }}>
        <Link passHref href={item.path === undefined ? '/' : `${item.path}`}>
          <MenuNavLink
            component={'a'}
            className={isNavLinkActive() ? 'active' : ''}
            {...(item.openInNewTab ? { target: '_blank' } : null)}
            onClick={e => {
              if (item.path === undefined) {
                e.preventDefault()
                e.stopPropagation()
              }
              if (navVisible) {
                toggleNavVisibility()
              }
            }}
            sx={{
              pl: 5.5,
              py: 1.7,
              ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' })
            }}
            title={item.title}
          >
            <ListItemIcon
              sx={{
                mr: 2.5,
                color: 'text.primary',
                transition: 'margin .25s ease-in-out'
              }}
            >
              <UserIcon icon={IconTag} />
            </ListItemIcon>

            <MenuItemTextMetaWrapper>
              <Typography
                variant={'body2'}
                {...(themeConfig.menuTextTruncate && { noWrap: true })}
                fontSize={isMobile ? 11 : 12.5}
              >
                {item.title}
              </Typography>
              {item.badgeContent ? (
                <Chip
                  label={item.badgeContent}
                  color={item.badgeColor || 'primary'}
                  sx={{
                    height: 17,
                    minWidth: 17,
                    fontWeight: 600,
                    fontSize: 9,
                    borderRadius: 0.5,
                    '& .MuiChip-label': { px: '5px', textTransform: 'capitalize' }
                  }}
                />
              ) : null}
            </MenuItemTextMetaWrapper>
          </MenuNavLink>
        </Link>
      </ListItem>
    </CanViewNavLink>
  )
}

export default VerticalNavLink
