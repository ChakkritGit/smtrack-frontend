import { HideFlashFW, Hidesetting, Islogout } from '../authen/authen'
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { lazy, Suspense, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, storeDispatchType } from '../stores/store'
import { AuthRoute } from '../middleware/authprotect'
import ErrorPage from '../routes/error-page'
import Home from '../pages/home/home'
import Dashboard from '../pages/dashboard/dashboard'
import Main from "../../src/main/main"
import Setting from '../pages/setting/setting'
import Permission from '../pages/users/manageusers'
import Warranty from '../pages/warranty/warranty'
import Repair from '../pages/repair/repair'
import Fullchart from '../pages/dashboard/fullchart'
import Fulltable from '../pages/dashboard/fulltable'
import System from '../pages/system/system'
import Comparechart from '../pages/dashboard/compare.chart'
import Log from '../pages/log/log'
import ESPToolComponent from '../pages/setting/devices/serial.port'
import SomethingWrong from './something-wrong'
import PreviewPDF from '../components/pdf/preview.pdf'
import Policy from '../pages/policy/policy'
import Support from '../pages/contact/support'
import Logs from '../pages/setting/Logs'
import Terms from '../pages/policy/terms'
import TmsMain from '../main/tms.main'
import TmsHome from '../pages/home/tms.home'
import { setTokenDecode } from '../stores/utilsStateSlice'
import toast, { useToasterStore } from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode'
import { jwtToken } from '../types/component.type'
import TmsDevice from '../pages/setting/devices/tms.device'
import TmsDashboard from '../pages/dashboard/tms.dashboard'

export default function RoutesComponent() {
  const dispatch = useDispatch<storeDispatchType>()
  const { tokenDecode, cookieDecode, isTms } = useSelector((state: RootState) => state.utilsState)
  const { token } = cookieDecode
  const { userLevel } = tokenDecode
  const { toasts } = useToasterStore()
  const toastLimit = 5
  const LazyTest = lazy(() => import('../pages/test/test'))

  const decodeToken = async () => {
    const decoded: jwtToken = await jwtDecode(token)
    dispatch(setTokenDecode(decoded))
  }

  useEffect(() => {
    if (!token) return
    decodeToken()
  }, [token])

  useEffect(() => {
    toasts
      .filter((toasts) => toasts.visible)
      .filter((_, index) => index >= toastLimit)
      .forEach((toasts) => toast.dismiss(toasts.id))
  }, [toasts])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthRoute />,
      children: (userLevel !== "4" && !isTms) || (userLevel === "0" && !isTms) ? [
        {
          path: "/",
          element: <Main />,
          errorElement: <SomethingWrong />,
          children: [
            {
              path: "/",
              element: <Home />,
              errorElement: <SomethingWrong />
            },
            {
              path: "dashboard",
              element: <Dashboard />,
              errorElement: <SomethingWrong />
            },
            {
              element: <Hidesetting />,
              errorElement: <SomethingWrong />,
              children: [
                {
                  path: "permission",
                  element: <Permission />,
                  errorElement: <SomethingWrong />
                },
                {
                  path: "management",
                  element: <Setting />,
                  errorElement: <SomethingWrong />
                },
                {
                  path: "management/:id",
                  element: <Setting />,
                  errorElement: <SomethingWrong />
                },
                {
                  path: 'logs',
                  element: <Logs routeLog={true} />,
                  errorElement: <SomethingWrong />
                }
              ],
            },
            {
              path: "warranty",
              element: <Warranty />,
              errorElement: <SomethingWrong />
            },
            {
              path: "repair",
              element: <Repair />,
              errorElement: <SomethingWrong />
            },
            {
              path: "settings",
              element: <System />,
              errorElement: <SomethingWrong />
            },
            {
              path: "dashboard/chart",
              element: <Fullchart />,
              errorElement: <SomethingWrong />
            },
            {
              path: "dashboard/chart/preview",
              element: <PreviewPDF />,
              errorElement: <SomethingWrong />
            },
            {
              path: "dashboard/table",
              element: <Fulltable />,
              errorElement: <SomethingWrong />
            },
            {
              path: "dashboard/chart/compare",
              element: <Comparechart />,
              errorElement: <SomethingWrong />
            },
            {
              path: "changeLog",
              element: <Log />,
              errorElement: <SomethingWrong />
            },
            ...(import.meta.env.VITE_APP_NODE_ENV === 'development'
              ? [
                {
                  path: "test",
                  element: (
                    <Suspense fallback={<div>Loading...</div>}>
                      <LazyTest />
                    </Suspense>
                  ),
                  errorElement: <SomethingWrong />
                }
              ]
              : []),
            {
              element: <HideFlashFW />,
              errorElement: <SomethingWrong />,
              children: [
                {
                  path: "management/flasher",
                  element: <ESPToolComponent />,
                  errorElement: <SomethingWrong />
                },
              ]
            }
          ],
        }
      ] : [
        {
          path: "/",
          element: <TmsMain />,
          errorElement: <SomethingWrong />,
          children: [
            {
              path: "/",
              element: <TmsHome />,
              errorElement: <SomethingWrong />
            },
            {
              path: "dashboard",
              element: <TmsDashboard />,
              errorElement: <SomethingWrong />
            },
            {
              element: <Hidesetting />,
              errorElement: <SomethingWrong />,
              children: [
                {
                  path: "management",
                  element: <TmsDevice />,
                  errorElement: <SomethingWrong />
                },
              ]
            },
            {
              path: "settings",
              element: <System />,
              errorElement: <SomethingWrong />
            },
            {
              path: "changeLog",
              element: <Log />,
              errorElement: <SomethingWrong />
            },
          ]
        },
      ],
    },
    {
      path: "/privacy-policy",
      element: <Policy />,
      errorElement: <SomethingWrong />
    },
    {
      path: "/terms-conditions",
      element: <Terms />,
      errorElement: <SomethingWrong />
    },
    {
      path: "/support",
      element: <Support />,
      errorElement: <SomethingWrong />
    },
    {
      path: "/login",
      element: <Islogout />,
      errorElement: <SomethingWrong />
    },
    {
      path: "*",
      element: <ErrorPage />,
      errorElement: <SomethingWrong />
    },
  ])

  return (
    <RouterProvider
      router={router}
    />
  )
}