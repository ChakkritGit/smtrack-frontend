import { Dispatch, SetStateAction } from "react"
import { cardType } from "./component.type"
import { probeType } from "./probe.type"

// userProps
type adduserProp = {
  pagestate: string,
  userData?: cardType
}
// closeUserProps

// wardProps
type addWardProp = {
  pagestate: string,
  openmodal: () => void
}
// closeWardProps

// hospitalsProps
type addHospitalProp = {
  pagestate: string,
  hosdata?: {
    hosId: string,
    hosName: string,
    hosTelephone: string,
    hosAddress: string,
    hosPic: string
  }
}
// closeHospitalsProps

// dropdownWardProps
type dropDownWardProp = {
  setStateWard: (value: string) => void,
  Hosid: string,
  groupId: string
}
// closeDropdownWardProps

// dropdownHospitalProps
type dropDownHospitalProp = {
  setHos_id: Dispatch<SetStateAction<string>>,
  Hosid?: string,
  page?: boolean
}
// closeDropdownHospitalProps

type addprobeProps = {
  pagestate: string,
  probeData?: probeType
}

export type {
  adduserProp, addWardProp, addHospitalProp, dropDownWardProp,
  dropDownHospitalProp, addprobeProps
}