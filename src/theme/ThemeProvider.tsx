import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { RootState } from '../stores/store'
import { useSelector } from 'react-redux'

interface Theme {
  mode: 'light' | 'dark' | 'system'
}

interface ThemeContextProps {
  theme: Theme
  toggleTheme: (mode: 'light' | 'dark' | 'system') => void
}

interface ThemeProvidersProps {
  children: ReactNode
}

const STORAGE_KEY = 'themeMode'

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

const ThemeProviders: React.FC<ThemeProvidersProps> = ({ children }) => {
  const { transparent } = useSelector((state: RootState) => state.utilsState)
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY) as Theme['mode']
    return { mode: storedTheme || 'system' }
  })

  const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

  const toggleTheme = (mode: 'light' | 'dark' | 'system') => {
    if (mode === 'system') {
      localStorage.removeItem(STORAGE_KEY)
      setTheme({ mode: getSystemTheme() })
    } else {
      localStorage.setItem(STORAGE_KEY, mode)
      setTheme({ mode })
    }
  }

  const handleSystemThemeChange = (event: MediaQueryListEvent) => {
    if (theme.mode === 'system') {
      setTheme({ mode: event.matches ? 'dark' : 'light' })
    }
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    if (theme.mode === 'system') {
      setTheme({ mode: getSystemTheme() })
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [theme.mode])

  useEffect(() => {
    const themeColorMetaTag = document.querySelector('meta[name="theme-color"]')
    const currentColor = theme.mode === 'light'
      ? transparent ? '#ffffff' : '#fcfcfc'
      : transparent ? '#353535' : '#2f2f2f'

    if (themeColorMetaTag) {
      themeColorMetaTag.setAttribute('content', currentColor)
    } else {
      const newMetaTag = document.createElement('meta')
      newMetaTag.setAttribute('name', 'theme-color')
      newMetaTag.setAttribute('content', currentColor)
      document.head.appendChild(newMetaTag)
    }

    const statusBarMetaTag = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    if (statusBarMetaTag) {
      statusBarMetaTag.setAttribute('content', currentColor)
    } else {
      const newStatusBarMetaTag = document.createElement('meta')
      newStatusBarMetaTag.setAttribute('name', 'apple-mobile-web-app-status-bar-style')
      newStatusBarMetaTag.setAttribute('content', currentColor)
      document.head.appendChild(newStatusBarMetaTag)
    }
  }, [theme.mode, transparent])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StyledThemeProvider theme={{ mode: theme.mode, transparent }}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  )
}

const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProviders')
  }
  return context
}

export { ThemeProviders, useTheme }
