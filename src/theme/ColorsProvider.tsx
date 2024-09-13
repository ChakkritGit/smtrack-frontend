// ColorProvider.tsx
import React, {
  createContext, useContext, useState, useEffect,
  ReactNode
} from 'react'
import { ThemeProvider as StyledColorProvider } from 'styled-components'

interface Color {
  colors: number
}

interface ColorContextProps {
  color: Color
  toggleColor: (color: Color) => void
}

interface ColorProviderProps {
  children: ReactNode
}

const STORAGE_KEY = 'colorKey'

const ColorContext = createContext<ColorContextProps | undefined>(undefined)

const ColorProvider: React.FC<ColorProviderProps> = ({ children }) => {
  const [color, setColor] = useState<Color>(() => {
    const storedColor = localStorage.getItem(STORAGE_KEY)
    return { colors: storedColor ? Number(storedColor) : 1 }
  })

  const toggleColor = (color: Color) => {
    setColor(color)
    localStorage.setItem(STORAGE_KEY, String(color.colors))
  }

  useEffect(() => {
    const storedColor = Number(localStorage.getItem(STORAGE_KEY))
    setColor({ colors: storedColor || 1 })
  }, [])

  return (
    <ColorContext.Provider value={{ color, toggleColor }}>
      <StyledColorProvider theme={{ colors: color.colors }}>
        {children}
      </StyledColorProvider>
    </ColorContext.Provider>
  )
}

const useColorContext = () => {
  const context = useContext(ColorContext)
  if (!context) {
    throw new Error('useColorContext must be used within a ColorProvider')
  }
  return context
}

export { ColorProvider, useColorContext }
