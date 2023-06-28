import { useMemo } from 'react'
import LoaderPage from '../views/loader'
import { useAuth } from '../@core/hooks/useAuth'
import { useRouter } from 'next/router'

export default function IndexPage() {
  const auth = useAuth()
  const router = useRouter()

  useMemo(() => {
    if (auth.user?.id && auth.acl?.length) {
      router.replace(auth.acl?.[0].subject as string)
    }
  }, [auth.user?.id, auth.acl])

  return <LoaderPage />
}
