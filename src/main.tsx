import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'react-loading-skeleton/dist/skeleton.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import ReloadPrompt from './components/reloadSW/ReloadPrompt'
import RoutesComponent from './routes/routes'
import isPropValid from '@emotion/is-prop-valid'
import i18n from './lang/i18n'
import ThemeProvider from 'react-bootstrap/ThemeProvider'
import GlobalColors from './theme/GlobalColor'
import GlobalStyles from './theme/GlobalStyles'
import { StyleSheetManager } from 'styled-components'
import { I18nextProvider } from 'react-i18next'
import { ThemeProviders } from './theme/ThemeProvider'
import { ColorProvider } from './theme/ColorsProvider'
import { store } from './stores/store'
import { Provider } from 'react-redux'

const renderApp = () => {
  if (import.meta.env.VITE_APP_NODE_ENV === 'production') {
    console.log = () => { }
  }

  const isInWebView = (() => {
    const userAgent = navigator.userAgent || (navigator as any).vendor || (window as any).opera
    const standalone = (navigator as any).standalone
    return /wv|webview/i.test(userAgent) || (standalone && !window.matchMedia('(display-mode: browser)').matches)
  })()

  const getBrowser = (): 'chrome' | 'edge' | 'firefox' | 'safari' | 'other' => {
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes('chrome') && !userAgent.includes('edg') && !userAgent.includes('opr')) {
      return 'chrome'
    } else if (userAgent.includes('edg')) {
      return 'edge'
    } else if (userAgent.includes('firefox')) {
      return 'firefox'
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      return 'safari'
    }
    return 'other'
  }

  const redirectToBrowser = () => {
    const url = window.location.href
    const browserUrls: { [key: string]: string } = {
      chrome: `googlechrome://navigate?url=${encodeURIComponent(url)}`,
      edge: `microsoft-edge://navigate?url=${encodeURIComponent(url)}`,
      firefox: `firefox://open-url?url=${encodeURIComponent(url)}`,
      safari: `safari://open?url=${encodeURIComponent(url)}`,
    }

    const browser = getBrowser()
    if (browserUrls[browser]) {
      window.open(browserUrls[browser], '_blank')
    } else {
      alert('Please open this page in Chrome, Edge, Firefox, or Safari\nกรุณาเปิดหน้านี้ในเบราว์เซอร์ Chrome, Edge, Firefox หรือ Safari')
      window.open('https://siamatic.co.th', '_blank')
    }
  }

  if (isInWebView) {
    redirectToBrowser()
    return
  }

  ReactDOM.createRoot(document.getElementById('appWrapper')!).render(
    <React.StrictMode>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <StyleSheetManager shouldForwardProp={isPropValid}>
            <ThemeProvider
              breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
              minBreakpoint="xxs">
              <ThemeProviders>
                <ColorProvider>
                  <ReloadPrompt />
                  <GlobalStyles />
                  <GlobalColors />
                  <RoutesComponent />
                </ColorProvider>
              </ThemeProviders>
            </ThemeProvider>
          </StyleSheetManager>
        </I18nextProvider>
      </Provider>
    </React.StrictMode>
  )
}

renderApp()
