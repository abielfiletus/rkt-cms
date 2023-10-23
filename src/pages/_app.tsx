// ** Next Imports
import Head from 'next/head'
import { NextRouter, Router, useRouter } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import themeConfig from '../configs/themeConfig'

// ** Component Imports
import UserLayout from '../layouts/UserLayout'
import ThemeComponent from '../@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from '../@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from '../@core/utils/create-emotion-cache'

// ** Spinner Import
import Spinner from '../@core/components/spinner'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'
import 'react-datepicker/dist/react-datepicker.css'
import WindowWrapper from '../@core/components/window-wrapper'
import AuthGuard from '../@core/components/AuthGuard'
import AclGuard from '../@core/components/AclGuard'
import { defaultACLObj } from '../configs/acl'
import { AuthProvider } from '../@core/context/AuthContext'
import { MenuBadgeProvider } from '../@core/context/MenuBadgeContext'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

export let router: NextRouter

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  router = useRouter()

  // Variables
  // @ts-ignore
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  // @ts-ignore
  const aclAbilities = Component.acl ?? defaultACLObj

  // @ts-ignore
  const guestGuard = Component.guestGuard ?? false

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`RKT Politeknik Negeri Ambon`}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover'></meta>
      </Head>

      <MenuBadgeProvider>
        <AuthProvider>
          <SettingsProvider>
            <SettingsConsumer>
              {({ settings }) => {
                // @ts-ignore
                return (
                  <ThemeComponent settings={settings}>
                    <WindowWrapper>
                      <AuthGuard fallback={<Spinner />}>
                        <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard}>
                          {/* @ts-ignore */}
                          {getLayout(<Component {...pageProps} />)}
                        </AclGuard>
                      </AuthGuard>
                    </WindowWrapper>
                  </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </AuthProvider>
      </MenuBadgeProvider>
    </CacheProvider>
  )
}

export default App
