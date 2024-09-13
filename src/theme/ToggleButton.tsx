// ToggleButton.tsx
import { useTheme } from './ThemeProvider'
import { RiMoonLine, RiSunLine } from 'react-icons/ri'
import { ToggleButtonWrapper } from '../style/style'

export default function ToggleButton() {
  const { theme, toggleTheme } = useTheme()

  return (
    <ToggleButtonWrapper onClick={toggleTheme}>
      <div className="icon">
        {theme.mode === 'dark' ? <RiMoonLine /> : <RiSunLine />}
      </div>
    </ToggleButtonWrapper>
  )
}
