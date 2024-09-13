// ThemeProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

interface Theme {
  mode: 'light' | 'dark'
}

interface ThemeContextProps {
  theme: Theme
  toggleTheme: () => void
}

interface ThemeProvidersProps {
  children: ReactNode
}

const STORAGE_KEY = 'themeMode'

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

const ThemeProviders: React.FC<ThemeProvidersProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY) as Theme['mode']
    return { mode: storedTheme || 'light' }
  })

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newMode = prevTheme.mode === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEY, newMode)
      return { mode: newMode }
    })
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY) as Theme['mode']
    const defaultTheme = typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    setTheme({ mode: storedTheme || defaultTheme })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StyledThemeProvider theme={{ mode: theme.mode }}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  )
}

const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export { ThemeProviders, useTheme }
