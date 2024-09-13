import { RiCheckLine, RiFullscreenLine } from "react-icons/ri"
import {
  ButtonColorChang, ChooseColorsContainer, ColorListFlex,
  ColorPalette, FullscreenBtn, H3mt, LineHr, SwitchMode
} from "../../style/style"
import { useColorContext } from "../../theme/ColorsProvider"
import { useTranslation } from "react-i18next"
import ToggleButton from "../../theme/ToggleButton"

export default function Color() {
  const { t } = useTranslation()
  const { color, toggleColor } = useColorContext()

  const colorOptions = [
    { color: 'palette1', label: 'defualtColor', value: 1 },
    { color: 'palette2', label: 'pColor', value: 2 },
    { color: 'palette3', label: 'pColor', value: 3 },
    { color: 'palette4', label: 'pColor', value: 4 },
    { color: 'palette5', label: 'pColor', value: 5 },
    { color: 'palette6', label: 'pColor', value: 6 },
    { color: 'palette7', label: 'pColor', value: 7 },
    { color: 'palette8', label: 'pColor', value: 8 },
    { color: 'palette9', label: 'pColor', value: 9 },
    { color: 'palette10', label: 'pColor', value: 10 },
    { color: 'palette11', label: 'pColor', value: 11 },
    { color: 'palette12', label: 'pColor', value: 12 },
    { color: 'palette13', label: 'pColor', value: 13 },
    { color: 'palette14', label: 'pColor', value: 14 },
    { color: 'palette15', label: 'pColor', value: 15 },
    { color: 'palette16', label: 'pColor', value: 16 },
    { color: 'palette17', label: 'pColor', value: 17 },
  ]

  const RenderColorOptions = () => (
    colorOptions.map(({ color: palette, label, value }, index) => (
      <ColorListFlex key={palette}>
        <ButtonColorChang $color={palette} onClick={() => {
          if (typeof color === 'object') {
            toggleColor({ ...color, colors: value })
          }
        }}>
          {color.colors === value && <RiCheckLine />}
        </ButtonColorChang>
        <span>{t(label)} {index !== 0 ? index : ''}</span>
      </ColorListFlex>
    ))
  )

  return (
    <ChooseColorsContainer>
      <h3>
        {t('chooseColor')}
      </h3>
      <ColorPalette>
        <RenderColorOptions />
      </ColorPalette>
      <LineHr />
      <H3mt>{t('mode')}</H3mt>
      <SwitchMode>
        <span>{t('appearanceMode')}</span><ToggleButton />
      </SwitchMode>
      <LineHr />
      <H3mt>{t('screen')}</H3mt>
      <SwitchMode>
        <span>{t('fullScreen')}</span>
        <FullscreenBtn onClick={() => {
          const element = document.documentElement;
          if (!document.fullscreenElement) {
            if (element.requestFullscreen) {
              element.requestFullscreen()
            }
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen()
            }
          }
        }}>
          <RiFullscreenLine />
        </FullscreenBtn>
      </SwitchMode>
    </ChooseColorsContainer>
  )
}
