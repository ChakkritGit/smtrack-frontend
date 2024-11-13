import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { RootState } from "../../stores/store"
import { useSelector } from "react-redux"
import { wardsType } from "../../types/ward.type"
import { useTheme } from "../../theme/ThemeProvider"
import { DevHomeHead, DeviceInfoSpan, DeviceInfoSpanClose, FilterHomeHOSWARD } from "../../style/style"
import { RiCloseLine, RiFilter3Line } from "react-icons/ri"
import { useTranslation } from "react-i18next"
import Select from "react-select"
import { hospitalsType } from "../../types/hospital.type"

interface Hospital {
  hosId: string,
  hosName: string,
}

interface Ward {
  wardId: string,
  wardName: string,
}

type Option = {
  value: string,
  label: string,
}

interface FilterProps {
  filterById: {
    hosId: string;
    wardId: string;
  };
  setFilterById: Dispatch<SetStateAction<{
    hosId: string;
    wardId: string;
  }>>
}

function FilterHosWardTemporary(filterProps: FilterProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const wardData = useSelector((state: RootState) => state.arraySlice.ward.wardData)
  const hospitalsData = useSelector((state: RootState) => state.arraySlice.hospital.hospitalsData)
  const { cookieDecode } = useSelector((state: RootState) => state.utilsState)
  const { userLevel } = cookieDecode
  const [wardName, setWardname] = useState<wardsType[]>([])
  const [filterdata, setFilterdata] = useState(false)
  const { filterById, setFilterById } = filterProps
  const { hosId, wardId } = filterById

  useEffect(() => {
    setWardname(wardData.filter((items) => hosId ? items.hospital.hosId.includes(hosId) : items))
  }, [wardData, hosId])

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

  const getHospital = (hospitalID: string | undefined) => {
    if (hospitalID !== '') {
      setFilterById({ ...filterById, hosId: String(hospitalID) })
      setWardname(wardData.filter((items) => hospitalID ? items.hospital.hosId.includes(hospitalID) : items))
    } else {
      setFilterById({ ...filterById, hosId: '' })
    }
  }

  const getWard = (wardID: string | undefined) => {
    if (wardID !== '') {
      setFilterById({ ...filterById, wardId: String(wardID) })
    } else {
      setFilterById({ ...filterById, wardId: '' })
    }
  }

  const allWard = { wardId: '', wardName: 'ALL', wardSeq: 0, hosId: '', createAt: '', updateAt: '', hospital: {} as hospitalsType }

  const updatedWardData = [allWard, ...wardName]

  const allHos = { hosId: '', hosName: 'ALL', createAt: '', updateAt: '', hospital: {} as hospitalsType }

  const updatedHosData = [allHos, ...hospitalsData]

  return (
    <div>
      {
        userLevel !== '3' &&
        <>
          {!filterdata &&
            <DeviceInfoSpan onClick={() => setFilterdata(true)}>
              {t('deviceFilter')}
              <RiFilter3Line />
            </DeviceInfoSpan>}
          <FilterHomeHOSWARD>
            {
              filterdata &&
              <DevHomeHead>
                {
                  userLevel !== '2' && <Select
                    options={mapOptions<Hospital, keyof Hospital>(updatedHosData, 'hosId', 'hosName')}
                    value={mapDefaultValue<Hospital, keyof Hospital>(updatedHosData, hosId ? hosId : '', 'hosId', 'hosName')}
                    onChange={(e) => getHospital(e?.value)}
                    autoFocus={false}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                        borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                        boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                        borderRadius: "var(--border-radius-big)",
                        width: "200px"
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
                }
                <Select
                  options={mapOptions<Ward, keyof Ward>(updatedWardData, 'wardId', 'wardName')}
                  value={mapDefaultValue<Ward, keyof Ward>(updatedWardData, wardId ? wardId : '', 'wardId', 'wardName')}
                  onChange={(e) => getWard(e?.value)}
                  autoFocus={false}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                      borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                      boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                      borderRadius: "var(--border-radius-big)",
                      width: "200px"
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
                <DeviceInfoSpanClose onClick={() => setFilterdata(false)}>
                  <RiCloseLine />
                </DeviceInfoSpanClose>
              </DevHomeHead>
            }
          </FilterHomeHOSWARD>
        </>
      }
    </div>
  )
}

export default FilterHosWardTemporary