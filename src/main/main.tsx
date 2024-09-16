import { Outlet } from "react-router-dom"
import Sidebar from "../components/navigation/sidebar"
import { SideParent, SideChild, SideChildOutlet, SideChildSide, HamburgerExpand } from "../style/style"
import Navbar from "../components/navigation/navbar"
import { MouseEventHandler, useEffect, useRef, useState } from "react"
import Offcanvas from 'react-bootstrap/Offcanvas'
import { Button } from "react-bootstrap"
import { RiMenuFoldLine } from "react-icons/ri"
import { jwtToken } from "../types/component.type"
import { jwtDecode } from "jwt-decode"
import { useDispatch, useSelector } from "react-redux"
import { DeviceState, DeviceStateStore, UtilsStateStore } from "../types/redux.type"
import { setShowAside, setTokenDecode } from "../stores/utilsStateSlice"
import { fetchHospitals, fetchWards, filtersDevices } from "../stores/dataArraySlices"
import { storeDispatchType } from "../stores/store"
import { fetchDevicesLog } from "../stores/LogsSlice"
import { fetchDevicesData } from "../stores/devicesSlices"
import { fetchUserData } from "../stores/userSlice"
import { fetchProbeData } from "../stores/probeSlice"
import Bottombar from "../components/navigation/bottombar"
import { BottomNavigateWrapper } from "../style/components/bottom.navigate"
import Popupcomponent from "../components/utils/popupcomponent"
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

export default function Main() {
  const dispatch = useDispatch<storeDispatchType>()
  const { socketData, showAside, deviceId, cookieDecode, reFetchData } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const { token } = cookieDecode
  const handleClose = () => dispatch(setShowAside(false))
  const handleShow = () => dispatch(setShowAside(true))
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  // const location = useLocation()
  const dispatchedDevices = useRef(new Map()).current
  const isFirstLoad = useRef(true)
  const maxDevices = devices.filter(f => f.backupStatus === '1').length || 15

  const decodeToken = async () => {
    const decoded: jwtToken = await jwtDecode(token)
    dispatch(setTokenDecode(decoded))
  }

  useEffect(() => {
    if (!token) return
    decodeToken()
    dispatch(filtersDevices(token))
    dispatch(fetchHospitals(token))
    dispatch(fetchWards(token))
    dispatch(fetchUserData(token))
    dispatch(fetchProbeData(token))
  }, [token])

  useEffect(() => {
    if (!token) return

    if (isFirstLoad.current) {
      dispatch(fetchDevicesData(token))
      isFirstLoad.current = false
      return
    }

    const { device: rawDeviceKey, message: rawMessage } = socketData || {}

    const deviceKey = rawDeviceKey?.trim().toLowerCase()
    const message = rawMessage?.trim().toLowerCase()

    if (!deviceKey || !message) return

    console.log('Checking hasSameEntry for:', deviceKey, message)
    console.log('Current dispatchedDevices:', Array.from(dispatchedDevices.entries()))

    const hasSameEntry = Array.from(dispatchedDevices.entries()).some(
      ([key, msg]) => key.toLowerCase().includes(deviceKey.toLowerCase()) && msg.toLowerCase().includes(message.toLowerCase())
    )

    if (hasSameEntry) {
      console.log(`\x1b[42mDevice ${deviceKey} already dispatched, waiting 30 seconds.\x1b[0m`)
      return
    }

    dispatch(fetchDevicesData(token))

    if (dispatchedDevices.size > maxDevices) {
      const oldestKey = dispatchedDevices.keys().next().value
      dispatchedDevices.delete(oldestKey)
      console.log('\x1b[41mRemoved oldest entry to maintain size:', Array.from(dispatchedDevices.entries()), '\x1b[0m')
    }

    console.log('Setting new device entry:', deviceKey, message)
    dispatchedDevices.set(deviceKey, message)

    console.log('\x1b[44mMap after set:', Array.from(dispatchedDevices.entries()), '\x1b[0m')

    const timer = setTimeout(() => {
      dispatchedDevices.delete(deviceKey)
      console.log('\x1b[41mMap after delete:', Array.from(dispatchedDevices.entries()), '\x1b[0m')
    }, 30000)

    return () => clearTimeout(timer)
  }, [socketData, token, dispatch, reFetchData])


  useEffect(() => {
    if (deviceId !== "undefined" && token) dispatch(fetchDevicesLog({ deviceId, token }))
  }, [deviceId, token])

  const handleContextMenu: MouseEventHandler<HTMLDivElement> = (_e) => {
    // e.preventDefault()
  }

  const handleScroll = () => {
    const currentScrollY = window.scrollY

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      // ถ้า scroll ลงและมากกว่า 50px ซ่อน navigation
      setIsScrollingDown(true)
    } else {
      // ถ้า scroll ขึ้น แสดง navigation
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

  // useEffect(() => {
  //   NProgress.configure({
  //     speed: 300,
  //     showSpinner: false
  //   })

  //   const handleRouteChangeStart = () => {
  //     NProgress.start()
  //   }

  //   const handleRouteChangeComplete = () => {
  //     NProgress.done()
  //   }

  //   handleRouteChangeStart()
  //   handleRouteChangeComplete()
  // }, [location.pathname])

  return (
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
  )
}
