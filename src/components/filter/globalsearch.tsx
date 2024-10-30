import { useEffect, useRef, useState } from "react"
import { RiCloseFill, RiSearchLine } from "react-icons/ri"
import {
  GlobalsearchContainer, GlobalsearchContainerMB, GlobalsearchInput,
  GlobalsearchMBIcon, KeyboardShortcut, MBSearchClearIcon, MBSearchCloseIcon, SearhIcon, SearhIconClose
} from "../../style/style"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { setSearchQuery } from "../../stores/utilsStateSlice"
import { RootState, storeDispatchType } from "../../stores/store"

export default function Globalsearch() {
  const dispatch = useDispatch<storeDispatchType>()
  const { searchQuery } = useSelector((state: RootState) => state.utilsState)
  const [showSearch, setShowSearch] = useState(false)
  const { t } = useTranslation()
  const searchRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const handleCk = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key?.toLowerCase() === "k") {
          e.preventDefault()
          searchRef.current?.focus()
        }
      }
    }

    window.addEventListener("keydown", handleCk)

    return () => {
      window.removeEventListener("keydown", handleCk)
    }
  }, [])

  return (
    <>
      <GlobalsearchContainer>
        <GlobalsearchInput
          type="text"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder={t('searchItemsNav')}
          ref={searchRef} />
        <SearhIcon>
          <RiSearchLine />
        </SearhIcon>
        {
          searchQuery ?
            <SearhIconClose onClick={() => dispatch(setSearchQuery(''))}>
              <RiCloseFill />
            </SearhIconClose>
            :
            <KeyboardShortcut>
              <span>Ctrl</span>
              <span>K</span>
            </KeyboardShortcut>
        }
      </GlobalsearchContainer>
      <>
        <GlobalsearchMBIcon onClick={() => setShowSearch(true)}>
          <RiSearchLine />
        </GlobalsearchMBIcon>
        <GlobalsearchContainerMB $primary={showSearch}>
          {
            searchQuery ?
            <MBSearchClearIcon onClick={() => dispatch(setSearchQuery(''))}>
                <RiCloseFill />
              </MBSearchClearIcon>
              :
              <></>
            }
            <GlobalsearchInput
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder={t('searchItemsNav')} />
          <MBSearchCloseIcon onClick={() => setShowSearch(false)}>
            <RiCloseFill />
          </MBSearchCloseIcon>
        </GlobalsearchContainerMB>
      </>
    </>
  )
}
