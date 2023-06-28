// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Component Imports
import { AbilityContext } from './Can'

// ** Types
import { NavSectionTitle } from '../../types'
import { abilityChecker } from '../../../../util/ability-checker'

interface Props {
  children: ReactNode
  navTitle?: NavSectionTitle
}

const CanViewNavSectionTitle = (props: Props) => {
  // ** Props
  const { children, navTitle } = props

  // ** Hook
  const ability = useContext(AbilityContext)

  return ability && abilityChecker(ability, { subject: navTitle?.subject || '', action: navTitle?.action || 'read' }) ? (
    <>{children}</>
  ) : null
}

export default CanViewNavSectionTitle
