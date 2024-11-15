import { Outlet } from "react-router-dom"
import Sidebar from "../components/navigation/sidebar"
import { SideParent, SideChild, SideChildOutlet, SideChildSide, HamburgerExpand, TabConnect } from "../style/style"
import Navbar from "../components/navigation/navbar"
import { MouseEventHandler, useEffect, useState } from "react"
import Offcanvas from 'react-bootstrap/Offcanvas'
import { Button } from "react-bootstrap"
import { RiMenuFoldLine } from "react-icons/ri"
import { useDispatch, useSelector } from "react-redux"
import {  setRefetchdata, setShowAside } from "../stores/utilsStateSlice"
import { fetchHospitals, fetchWards, filtersDevices } from "../stores/dataArraySlices"
import { RootState, storeDispatchType } from "../stores/store"
import { fetchDevicesLog } from "../stores/LogsSlice"
import { fetchDevicesData } from "../stores/devicesSlices"
import { fetchUserData } from "../stores/userSlice"
import { fetchProbeData } from "../stores/probeSlice"
import Bottombar from "../components/navigation/bottombar"
import { BottomNavigateWrapper } from "../style/components/bottom.navigate"
import Popupcomponent from "../components/utils/popupcomponent"
import { setSocketData } from '../stores/utilsStateSlice'
import { client } from '../services/mqtt'
import { socketResponseType } from '../types/component.type'
import { socket } from '../services/websocket'
import { useTranslation } from "react-i18next"

export default function Main() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { socketData, showAside, deviceId, cookieDecode, reFetchData, tokenDecode } = useSelector((state: RootState) => state.utilsState)
  const { token } = cookieDecode
  const { userLevel, hosId } = tokenDecode
  const handleClose = () => dispatch(setShowAside(false))
  const handleShow = () => dispatch(setShowAside(true))
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [status, setStatus] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!token) return
    if (userLevel === "4") return
    dispatch(filtersDevices(token))
    dispatch(fetchHospitals(token))
    dispatch(fetchWards(token))
    dispatch(fetchUserData(token))
    dispatch(fetchProbeData(token))
  }, [token, userLevel])

  useEffect(() => {
    if (userLevel === "4") return
    if (!token) return
    dispatch(fetchDevicesData(token))
  }, [socketData, token, dispatch, userLevel])

  useEffect(() => {
    if (!token) return
    if (userLevel === "4") return
    if (reFetchData) {
      dispatch(fetchDevicesData(token))
      dispatch(fetchProbeData(token))
      dispatch(setRefetchdata(false))
    }
  }, [reFetchData, token, userLevel])

  useEffect(() => {
    if (deviceId !== "undefined" && token) dispatch(fetchDevicesLog({ deviceId, token }))
  }, [deviceId, token, socketData, reFetchData])

  const handleContextMenu: MouseEventHandler<HTMLDivElement> = (_e) => {
    // e.preventDefault()
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
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  useEffect(() => {
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data.type === 'RELOAD_PAGE') {
        window.location.reload()
      }
    })
  }, [])

  const handleConnect = () => { }
  const handleDisconnect = (reason: any) => console.error("Disconnected from Socket server:", reason)
  const handleError = (error: any) => console.error("Socket error:", error)
  const handleMessage = (response: socketResponseType) => {
    if (!userLevel && !hosId) return
    if (userLevel === "4") return

    if (userLevel === "0" || userLevel === "1" || hosId === response.hospital) {
      dispatch(setSocketData(response))
    }
  }

  useEffect(() => {
    socket.on("connect", handleConnect)
    socket.on("disconnect", handleDisconnect)
    socket.on("error", handleError)
    socket.on("receive_message", handleMessage)
    // socket.on("device_event", handleDeviceEvent)

    return () => {
      socket.off("connect", handleConnect)
      socket.off("disconnect", handleDisconnect)
      socket.off("error", handleError)
      socket.off("receive_message", handleMessage)
      // socket.off("device_event", handleDeviceEvent)
    }
  }, [userLevel, hosId, userLevel])

  useEffect(() => {
    try {
      client.on('connect', () => { setStatus(false); setTimeout(() => { setShow(false) }, 3000) })
      client.on('disconnect', () => { setStatus(true); setShow(true) })
    } catch (error) {
      console.error("MQTT Error: ", error)
    }
  }, [])

  useEffect(() => {
    const handleOffline = () => { setStatus(true); setShow(true) }
    const handleOnline = () => {
      setStatus(false)
      setTimeout(() => { setShow(false) }, 3000)
      if (!token) return
      if (deviceId !== "undefined") dispatch(fetchDevicesLog({ deviceId, token }))
      if (userLevel !== '4') {
        dispatch(fetchDevicesData(token))
        dispatch(filtersDevices(token))
        dispatch(fetchHospitals(token))
        dispatch(fetchWards(token))
        dispatch(fetchUserData(token))
        dispatch(fetchProbeData(token))
      }
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [token, deviceId, userLevel])

  return (
    <>
      <SideParent onContextMenu={handleContextMenu}>
        <Popupcomponent />
        <SideChildSide $primary>
          <Sidebar />
        </SideChildSide>
        <Offcanvas show={showAside} onHide={handleClose} >
          <HamburgerExpand $primary={false}>
            <Button onClick={handleClose}>
              <RiMenuFoldLine />
            </Button>
          </HamburgerExpand>
          <Sidebar />
        </Offcanvas>
        <SideParent $primary>
          <SideChild>
            <Navbar handleShow={handleShow} />
          </SideChild>
          <SideChildOutlet>
            <Outlet />
          </SideChildOutlet>
          <BottomNavigateWrapper $primary={isScrollingDown}>
            <Bottombar isScrollingDown={isScrollingDown} />
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
