import { TbMoon, TbSun, TbSunMoon } from "react-icons/tb"
import { useTheme } from './ThemeProvider'
import { useEffect, useRef, useState } from 'react'
import { IconWrapper, ModeOption, WrapperMenu, WrapperSwitch } from '../style/style'
import { useTranslation } from 'react-i18next'

export default function ToggleButton() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const { mode } = theme
  const [openMenu, setOpenMenu] = useState(false)
  const storeLocalTheme = localStorage.getItem('themeMode') ?? false

  const menuRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (e: MouseEvent) => {
    if (
      menuRef.current && !menuRef.current.contains(e.target as Node) &&
      iconRef.current && !iconRef.current.contains(e.target as Node)
    ) {
      setOpenMenu(false)
    }
  }

  useEffect(() => {
    if (openMenu) {
      document.addEventListener('click', handleClickOutside)
    } else {
      document.removeEventListener('click', handleClickOutside)
    }
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [openMenu])

  const isSystemActive = mode === 'system'

  return (
    <WrapperSwitch>
      <IconWrapper onClick={() => setOpenMenu(!openMenu)} ref={iconRef}>
        {storeLocalTheme === 'light' && mode === 'light' ?
          <TbSun size={24} />
          : storeLocalTheme === 'dark' && mode === 'dark' ?
            <TbMoon size={24} />
            :
            <TbSunMoon size={24} />
        }
      </IconWrapper>

      {openMenu && <WrapperMenu ref={menuRef} $openMenu={openMenu} >
        <ModeOption onClick={() => toggleTheme('light')} $active={storeLocalTheme === 'light' && mode === 'light'}>
          <TbSun size={24} />
          <span>{t('lightMode')}</span>
        </ModeOption>
        <ModeOption onClick={() => toggleTheme('dark')} $active={storeLocalTheme === 'dark' && mode === 'dark'}>
          <TbMoon size={24} />
          <span>{t('darkMode')}</span>
        </ModeOption>
        <ModeOption onClick={() => toggleTheme('system')} $active={!isSystemActive && !storeLocalTheme}>
          <TbSunMoon size={24} />
          <span>{t('systemMode')}</span>
        </ModeOption>
      </WrapperMenu>}
    </WrapperSwitch>
  )
}
