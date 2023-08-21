// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Types
import { apiGet } from '../../util/api-fetch'
import authConfig from '../../configs/auth'
import { useRouter } from 'next/router'
import { MenuBadgeType } from './types'

// ** Defaults
const defaultProvider: MenuBadgeType = {
  verify_rkt: 0,
  setVerifyRkt: () => null
}

const MenuBadgeContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const MenuBadgeProvider = ({ children }: Props) => {
  // ** States
  const [verifyRkt, setVerifyRkt] = useState<number>(defaultProvider.verify_rkt)
  const router = useRouter()

  useEffect(() => {
    const initData = async (): Promise<void> => {
      const token = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (token) {
        const res = await apiGet('/penyusunan-rkt/outstanding-summary')
        setVerifyRkt(res?.data)
      }
    }

    initData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route])

  const values = {
    verify_rkt: verifyRkt,
    setVerifyRkt
  }

  return <MenuBadgeContext.Provider value={values}>{children}</MenuBadgeContext.Provider>
}

export { MenuBadgeContext, MenuBadgeProvider }
