import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri"
import LangguageSelector from "../lang/LangguageSelector"
import Notification from "../../pages/notification/notification"
import Navprofile from "../../pages/profile/navprofile"
import { ExpandContainer, ExpandSidebar, HamburgerExpand, Nav, NavRight, NavRightPipe, Navleft } from "../../style/style"
import Button from 'react-bootstrap/Button'
import { useEffect } from "react"
import Globalsearch from "../filter/globalsearch"
import { useDispatch, useSelector } from "react-redux"
import { setExpand } from "../../stores/utilsStateSlice"
import { RootState, storeDispatchType } from "../../stores/store"
import ToggleButton from "../../theme/ToggleButton"

type navbar = {
  handleShow: () => void
}

export default function Navbar(navbar: navbar) {
  const dispatch = useDispatch<storeDispatchType>()
  const { expand, transparent } = useSelector((state: RootState) => state.utilsState)
  useEffect(() => {
    localStorage.setItem('expandaside', expand.toString())
  }, [expand])

  return (
    <Nav $transparent={transparent}>
      <Navleft>
        <ExpandContainer>
          <ExpandSidebar onClick={() => expand ? dispatch(setExpand(false)) : dispatch(setExpand(true))}>
            {
              expand ? <RiMenuUnfoldLine /> : <RiMenuFoldLine />
            }
          </ExpandSidebar>
        </ExpandContainer>
        <HamburgerExpand $primary={true}>
          <Button onClick={navbar.handleShow}>
            <RiMenuUnfoldLine />
          </Button>
        </HamburgerExpand>
        <Globalsearch />
        {import.meta.env.VITE_APP_NODE_ENV === 'development' && <div>{import.meta.env.VITE_APP_API}</div>}
      </Navleft>
      <NavRight>
        <Notification />
        <NavRightPipe />
        <LangguageSelector />
        <ToggleButton />
        <NavRightPipe />
        <Navprofile />
      </NavRight>
    </Nav>
  )
}
