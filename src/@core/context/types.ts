import { CheckAbility } from '../../configs/acl'

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  nip: string
  password: string
}

export type UserDataType = {
  id: number
  role: Record<string, any>
  email: string
  fullName: string
  username: string
  password: string
  avatar?: string | null
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  acl: CheckAbility[] | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  setAcl: (value: any) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}
