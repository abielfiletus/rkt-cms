// ** React Imports
import { ReactNode, useMemo, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Types
import type { ACLObj, AppAbility } from '../../../configs/acl'

// ** Context Imports
import { AbilityContext } from '../../layouts/components/acl/Can'

// ** Config Import
import { buildAbilityFor } from '../../../configs/acl'

// ** Component Import
import NotAuthorized from '../../../pages/permission-denied'
import BlankLayout from '../../../@core/layouts/BlankLayout'

// ** Hooks
import { useAuth } from '../../hooks/useAuth'
import { abilityChecker } from '../../../util/ability-checker'

interface AclGuardProps {
  children: ReactNode
  guestGuard: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard } = props

  const [ability, setAbility] = useState<AppAbility | undefined>(undefined)

  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  useMemo(() => {
    if (!auth.user?.id) setAbility(undefined)
  }, [auth.user])

  // If guestGuard is true and user is not logged in or its an error page, render the page without checking access
  if (
    guestGuard ||
    router.route === '/not-found' ||
    router.route === '/500' ||
    router.route === '/' ||
    router.pathname.includes('login')
  ) {
    return <>{children}</>
  }

  // User is logged in, build ability for the user based on his role
  if (auth.user && auth.user.role?.id && !ability && auth.acl?.length) {
    setAbility(buildAbilityFor(auth.acl))
  }

  // Check the access of current user and render pages
  if (ability && abilityChecker(ability, aclAbilities)) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard
