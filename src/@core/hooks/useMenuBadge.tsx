import { useContext } from 'react'
import { MenuBadgeContext } from '../context/MenuBadgeContext'

export const useMenuBadge = () => useContext(MenuBadgeContext)
