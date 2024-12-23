import { MouseEventHandler, useEffect, useState } from "react"
import {
  HamburgerExpand, SideChild, SideChildOutlet, SideChildSide,
  SideParent, TabConnect
} from "../style/style"
import Popupcomponent from "../components/utils/popupcomponent"
import { Button, Offcanvas } from "react-bootstrap"
import { RiMenuFoldLine } from "react-icons/ri"
import { useDispatch, useSelector } from "react-redux"
import { RootState, storeDispatchType } from "../stores/store"
import { setShowAside, setSocketData } from "../stores/utilsStateSlice"
import Navbar from "../components/navigation/navbar"
import { BottomNavigateWrapper } from "../style/components/bottom.navigate"
import { Outlet } from "react-router-dom"
import SecondSidebar from "../components/navigation/tms.sidebar"
import SecondBottombar from "../components/navigation/tms.bottombar"
import { useTranslation } from "react-i18next"
import { fetchTmsDevice } from "../stores/tms.deviceSlice"
import { socket } from "../services/websocket"
import { socketResponseType } from "../types/component.type"
import { fetchHospitals, fetchWards } from "../stores/dataArraySlices"
import { fetchTmsDeviceLog } from "../stores/tms.device.log"

const TmsMain = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { showAside, cookieDecode, reFetchData, socketData, isTms, tokenDecode, Serial } = useSelector((state: RootState) => state.utilsState)
  const { token, hosId } = cookieDecode
  const { role } = tokenDecode
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const handleClose = () => dispatch(setShowAside(false))
  const handleShow = () => dispatch(setShowAside(true))
  const [show, setShow] = useState(false)
  const [status, setStatus] = useState(false)

  const handleConnect = () => { }
  const handleDisconnect = (reason: any) => console.error("Disconnected from Socket server:", reason)
  const handleError = (error: any) => console.error("Socket error:", error)
  const handleMessage = (response: socketResponseType) => {
    if (!role && !hosId) return
    if (role === "LEGACY_ADMIN" || role === "LEGACY_USER") return

    if (hosId === response.hospital) {
      dispatch(setSocketData(response))
    }
  }

  useEffect(() => {
    socket.on("connect", handleConnect)
    socket.on("disconnect", handleDisconnect)
    socket.on("error", handleError)
    socket.on("receive_message", handleMessage)

    return () => {
      socket.off("connect", handleConnect)
      socket.off("disconnect", handleDisconnect)
      socket.off("error", handleError)
      socket.off("receive_message", handleMessage)
    }
  }, [role, hosId])

  const handleContextMenu: MouseEventHandler<HTMLDivElement> = (e) => {
    if (import.meta.env.VITE_APP_NODE_ENV === 'production') {
      e.preventDefault()
    }
  }

  if (import.meta.env.VITE_APP_NODE_ENV === 'production') {
    document.addEventListener('keydown', function (event) {
      if (event.ctrlKey && event.shiftKey && event.key === 'I' ||
        event.ctrlKey && event.shiftKey && event.key === 'C' ||
        event.ctrlKey && event.shiftKey && event.key === 'J' ||
        event.ctrlKey && event.key === 'u' ||
        event.key === 'F12') {
        event.preventDefault()
      }
    })
  }

  const handleScroll = () => {
    const currentScrollY = window.scrollY

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      setIsScrollingDown(true)
    } else {
      setIsScrollingDown(false)
    }
    setLastScrollY(currentScrollY)
  }

  useEffect(() => {
    if (!token) return
    if (role === "LEGACY_ADMIN" || role === "LEGACY_USER" || isTms) {
      dispatch(fetchHospitals())
      dispatch(fetchWards())
    }
  }, [token, role])

  useEffect(() => {
    if (!token) return
    if (role === "LEGACY_ADMIN" || role === "LEGACY_USER" || isTms) {
      dispatch(fetchTmsDevice())
    }
  }, [socketData, token, dispatch, role])

  useEffect(() => {
    if (!token) return
    if (role === "LEGACY_ADMIN" || role === "LEGACY_USER" && reFetchData || isTms) {
      dispatch(fetchTmsDevice())
    }
  }, [token, reFetchData, role])

  useEffect(() => {
    if (Serial !== "undefined" && token) dispatch(fetchTmsDeviceLog(Serial))
  }, [Serial, token, socketData, reFetchData])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  useEffect(() => {
    const handleOffline = () => { setStatus(true); setShow(true) }
    const handleOnline = () => {
      setStatus(false)
      setTimeout(() => { setShow(false) }, 3000)
      if (!token) return
      if (role === "LEGACY_ADMIN" || role === "LEGACY_USER") {
        dispatch(fetchTmsDevice())
        dispatch(fetchHospitals())
        dispatch(fetchWards())
      }
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [token])

  useEffect(() => {
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data.type === 'RELOAD_PAGE') {
        window.location.reload()
      }
    })
  }, [])

  return (
    <>
      <SideParent onContextMenu={handleContextMenu}>
        <Popupcomponent />
        <SideChildSide $primary>
          <SecondSidebar />
        </SideChildSide>
        <Offcanvas show={showAside} onHide={handleClose} >
          <HamburgerExpand $primary={false}>
            <Button onClick={handleClose}>
              <RiMenuFoldLine />
            </Button>
          </HamburgerExpand>
          <SecondSidebar />
        </Offcanvas>
        <SideParent $primary>
          <SideChild>
            <Navbar handleShow={handleShow} />
          </SideChild>
          <SideChildOutlet>
            <Outlet />
          </SideChildOutlet>
          <BottomNavigateWrapper $primary={isScrollingDown}>
            <SecondBottombar isScrollingDown={isScrollingDown} />
          </BottomNavigateWrapper>
        </SideParent>
      </SideParent>
      {
        show && <TabConnect $primary={status} $show={show}>
          <span>{status ? t('stateDisconnect') : t('stateConnect')}</span>
        </TabConnect>
      }
    </>
  )
}

export default TmsMain