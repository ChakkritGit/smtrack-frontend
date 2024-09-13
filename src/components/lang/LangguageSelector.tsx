import { useEffect } from "react"
import { useTranslation } from 'react-i18next'
import { Dropdown } from "react-bootstrap"
import { LangFlag, LangFlagFlex, LangSwitch, LangSwitchContainer, LangText } from "../../style/style"
import { RiEarthLine } from "react-icons/ri"
import Th from "../../assets/svg/th.svg"
import En from "../../assets/svg/us.svg"
import { LangContainer, LangSwitchButton } from "../../style/components/language"

export default function LangguageSelector() {
  const { i18n } = useTranslation()
  const langs = localStorage.getItem("lang") || 'th'

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
    localStorage.setItem("lang", language)
  }

  useEffect(() => {
    if (langs) {
      i18n.changeLanguage(langs)
    }
  }, [i18n])

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle variant="0" className="border-0 p-0">
          <LangSwitchContainer>
            <LangSwitch>
              <RiEarthLine />
              <LangText>
                {langs == 'th' ? "TH" : langs == 'en' ? "EN" : langs == 'cn' ? "CN" : langs == 'jp' ? "JP" : "TH"}
              </LangText>
            </LangSwitch>
          </LangSwitchContainer>
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ width: '180px' }}>
          <LangContainer>
            <LangSwitchButton $lang={langs == 'th'} onClick={() => changeLanguage('th')}>
              <LangFlagFlex>
                <LangFlag src={Th} alt="flag-icon" />
                <span>ไทย</span>
              </LangFlagFlex>
            </LangSwitchButton >
            <LangSwitchButton $lang={langs == 'en'} onClick={() => changeLanguage('en')}>
              <LangFlagFlex>
                <LangFlag src={En} alt="flag-icon" />
                <span>English <small>(US)</small></span>
              </LangFlagFlex>
            </LangSwitchButton>
          </LangContainer>
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}
