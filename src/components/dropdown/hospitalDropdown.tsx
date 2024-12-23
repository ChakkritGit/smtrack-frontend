import { dropDownHospitalProp } from "../../types/prop.type"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import Select, { SingleValue } from 'react-select'
import { useTheme } from "../../theme/ThemeProvider"
import { RootState } from "../../stores/store"

type Option = {
  value: string,
  label: string,
}

type Hospital = {
  id: string,
  hosName: string,
}

export default function HospitalDropdown(hosprop: dropDownHospitalProp) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { setHos_id, Hosid, page } = hosprop
  const hospitalsData = useSelector((state: RootState) => state.arraySlice.hospital.hospitalsData)

  const setHosId = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    if (page) {
      setHos_id(e?.label)
    } else {
      setHos_id(selectedValue)
    }
  }

  const mapOptions = <T, K extends keyof T>(data: T[], valueKey: K, labelKey: K): Option[] =>
    data.map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))

  const mapDefaultValue = <T, K extends keyof T>(data: T[], id: string, valueKey: K, labelKey: K): Option | undefined =>
    data.filter(item => item[valueKey] === id).map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))[0]

  return (
    <Select
      options={mapOptions<Hospital, keyof Hospital>(hospitalsData, 'id', 'hosName')}
      value={mapDefaultValue<Hospital, keyof Hospital>(hospitalsData, String(Hosid), 'id', 'hosName')}
      onChange={setHosId}
      autoFocus={false}
      placeholder={t('selectDeviceDrop')}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
          borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
          boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
          borderRadius: "var(--border-radius-big)"
        }),
      }}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary50: 'var(--main-color-opacity2)',
          primary25: 'var(--main-color-opacity2)',
          primary: 'var(--main-color)',
        },
      })}
      className="react-select-container"
      classNamePrefix="react-select"
    />
  )
}
