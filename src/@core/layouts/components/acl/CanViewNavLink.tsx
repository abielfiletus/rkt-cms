// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Component Imports
import { AbilityContext } from './Can'

// ** Types
import { NavLink } from '../../../../layouts/types'
import { abilityChecker } from '../../../../util/ability-checker'

interface Props {
  navLink?: NavLink
  children: ReactNode
}

const CanViewNavLink = (props: Props) => {
  // ** Props
  const { children, navLink } = props

  // ** Hook
  const ability = useContext(AbilityContext)

  return ability && abilityChecker(ability, { action: navLink?.action || 'read', subject: navLink?.subject || '' }) ? (
    <>{children}</>
  ) : null
}

export default CanViewNavLink
