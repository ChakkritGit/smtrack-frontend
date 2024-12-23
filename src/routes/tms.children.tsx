import { lazy, Suspense } from "react"
import { Hidesetting } from "../authen/authen"
import SomethingWrong from "./something-wrong"
import PageLoading from "../components/loading/page.loading"
const TmsHome = lazy(() => import('../pages/home/tms.home'))
const TmsDashboard = lazy(() => import('../pages/dashboard/tms.dashboard'))
const TmsDevice = lazy(() => import('../pages/setting/devices/tms.device'))
const System = lazy(() => import('../pages/system/system'))
const TmsFullChart = lazy(() => import('../pages/dashboard/tms.fullchart'))
const TmsFullTable = lazy(() => import('../pages/dashboard/tms.fulltable'))
const PreviewPDF = lazy(() => import('../components/pdf/preview.pdf'))
const Log = lazy(() => import('../pages/log/log'))

export const tmsChildren = [
  {
    path: "/",
    element: <Suspense fallback={<PageLoading />}>
      <TmsHome />
    </Suspense>,
    errorElement: <SomethingWrong />
  },
  {
    path: "dashboard",
    element: <Suspense fallback={<PageLoading />}>
      <TmsDashboard />
    </Suspense>,
    errorElement: <SomethingWrong />
  },
  {
    element: <Hidesetting />,
    errorElement: <SomethingWrong />,
    children: [
      {
        path: "management",
        element: <Suspense fallback={<PageLoading />}>
          <TmsDevice />
        </Suspense>,
        errorElement: <SomethingWrong />
      },
    ]
  },
  {
    path: "settings",
    element: <Suspense fallback={<PageLoading />}>
      <System />
    </Suspense>,
    errorElement: <SomethingWrong />
  },
  {
    path: "dashboard/chart",
    element: <Suspense fallback={<PageLoading />}>
      <TmsFullChart />
    </Suspense>,
    errorElement: <SomethingWrong />
  },
  {
    path: "dashboard/chart/preview",
    element: <Suspense fallback={<PageLoading />}>
      <PreviewPDF />
    </Suspense>,
    errorElement: <SomethingWrong />
  },
  {
    path: "dashboard/table",
    element: <Suspense fallback={<PageLoading />}>
      <TmsFullTable />
    </Suspense>,
    errorElement: <SomethingWrong />
  },
  {
    path: "changeLog",
    element: <Suspense fallback={<PageLoading />}>
      <Log />
    </Suspense>,
    errorElement: <SomethingWrong />
  },
]