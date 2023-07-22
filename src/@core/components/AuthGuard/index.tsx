// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from '../../hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(
    () => {
      if (!router.isReady) {
        return
      }

      if (window.localStorage.getItem('access') && router.query.returnUrl) {
        router.replace(router.query.returnUrl as string)
      }

      if (!router.pathname.includes('login') && !window.localStorage.getItem('access')) {
        auth.setUser(null)
        auth.setAcl(null)

        if (router.asPath !== '/') {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace('/login')
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  )

  if (window.localStorage.getItem('access') && router.query.returnUrl) {
    router.replace(router.query.returnUrl as string)
  }

  if (!router.pathname.includes('login') && auth.loading) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
