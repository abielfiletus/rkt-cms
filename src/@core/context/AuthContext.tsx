// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Config
import authConfig from '../../configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'
import { apiGet, apiPost } from '../../util/api-fetch'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  acl: null,
  loading: true,
  setUser: () => null,
  setAcl: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

const baseUrl = process.env.NEXT_PUBLIC_BE_URL + '/'

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [acl, setAcl] = useState<any>(defaultProvider.acl)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      const userId = window.localStorage.getItem('id')
      if (storedToken) {
        setLoading(true)
        try {
          const [userRes, permissionsRes] = await Promise.all([
            apiGet(authConfig.meEndpoint + userId),
            apiGet(authConfig.permissionsEndpoint)
          ])

          if (userRes.data?.avatar) {
            userRes.data.avatar = baseUrl + userRes.data.avatar
          }

          setLoading(false)
          setUser({ ...userRes.data })
          setAcl(permissionsRes.data)
        } catch (err) {
          localStorage.removeItem('access')
          localStorage.removeItem('name')
          localStorage.removeItem('nip')
          localStorage.removeItem('id')
          localStorage.removeItem('email')
          localStorage.removeItem('prodi')
          localStorage.removeItem('role')
          localStorage.removeItem('department')
          localStorage.removeItem('avatar')
          setUser(null)
          setAcl(null)
          setLoading(false)
          if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
            router.replace('/login')
          }
        }
      } else {
        setLoading(false)
        handleLogout()
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (params: LoginParams, errorCallback?: ErrCallbackType) => {
    try {
      const response = await apiPost(authConfig.loginEndpoint, params)

      if (response.code === 422 && errorCallback) return errorCallback(response.error)

      const returnUrl = router.query.returnUrl

      setUser({ ...response.data })

      window.localStorage.setItem('access', response.data.token)
      window.localStorage.setItem('name', response.data.name)
      window.localStorage.setItem('nip', response.data.nip)
      window.localStorage.setItem('id', response.data.id)
      window.localStorage.setItem('email', response.data.email)
      window.localStorage.setItem('prodi', JSON.stringify(response.data.prodi))
      window.localStorage.setItem('role', JSON.stringify(response.data.role))
      window.localStorage.setItem('department', JSON.stringify(response.data.department))
      window.localStorage.setItem('avatar', response.data.avatar ? baseUrl + response.data.avatar : '')

      const permissions = await apiGet(authConfig.permissionsEndpoint)
      setAcl(permissions?.data)

      let redirectURL = '/'

      if (permissions?.data?.length) redirectURL = permissions?.data[0].subject
      if (returnUrl && returnUrl !== '/') redirectURL = returnUrl as string

      await router.replace(redirectURL as string)
    } catch (err: any) {
      if (errorCallback) errorCallback(err)
      else throw err
    }
  }

  const handleLogout = () => {
    setUser(null)
    setAcl(null)
    window.localStorage.removeItem('access')
    window.localStorage.removeItem('name')
    window.localStorage.removeItem('nip')
    window.localStorage.removeItem('id')
    window.localStorage.removeItem('email')
    window.localStorage.removeItem('prodi')
    window.localStorage.removeItem('role')
    window.localStorage.removeItem('department')
    window.localStorage.removeItem('avatar')
    router.push('/login')
  }

  const values = {
    user,
    acl,
    loading,
    setUser,
    setAcl,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
