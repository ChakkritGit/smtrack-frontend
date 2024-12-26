import { lazy, Suspense } from "react"
import { HideFlashFW, HideSetting } from "../authen/authen"
import PreviewPDF from "../components/pdf/preview.pdf"
import Comparechart from "../pages/dashboard/compare.chart"
import Dashboard from "../pages/dashboard/dashboard"
import Fullchart from "../pages/dashboard/fullchart"
import Fulltable from "../pages/dashboard/fulltable"
// import Home from "../pages/home/home"
import Log from "../pages/log/log"
import Repair from "../pages/repair/repair"
import Logs from "../pages/setting/Logs"
import Setting from "../pages/setting/setting"
import System from "../pages/system/system"
import Permission from "../pages/users/manageusers"
import Warranty from "../pages/warranty/warranty"
import SomethingWrong from "./something-wrong"
import PageLoading from "../components/loading/page.loading"
import { RouteObject } from "react-router-dom"
const LazyTest = lazy(() => import('../pages/test/test'))
const Home = lazy(() => import('../pages/home/home'))
const ESPToolComponent = lazy(() => import('../pages/setting/devices/serial.port'))

export const smtrackChildren: RouteObject[] = [
  {
    path: "/",
    element: <Suspense fallback={<PageLoading />}>
      <Home />
    </Suspense>,
    errorElement: <SomethingWrong />
  },
  {
    path: "dashboard",
    element: <Dashboard />,
    errorElement: <SomethingWrong />
  },
  {
    element: <HideSetting />,
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
          <Suspense fallback={<PageLoading />}>
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
        element: <Suspense fallback={<PageLoading />}>
          <ESPToolComponent />
        </Suspense>,
        errorElement: <SomethingWrong />
      },
    ]
  }
]