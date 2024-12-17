import { Hidesetting } from "../authen/authen";
import TmsDashboard from "../pages/dashboard/tms.dashboard";
import TmsFullChart from "../pages/dashboard/tms.fullchart";
import TmsHome from "../pages/home/tms.home";
import Log from "../pages/log/log";
import TmsDevice from "../pages/setting/devices/tms.device";
import System from "../pages/system/system";
import SomethingWrong from "./something-wrong";

export const tmsChildren = [
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
    path: "dashboard/chart",
    element: <TmsFullChart />,
    errorElement: <SomethingWrong />
  },
  {
    path: "dashboard/chart/preview",
    element: <div>pdf</div>,
    errorElement: <SomethingWrong />
  },
  {
    path: "dashboard/table",
    element: <div>table</div>,
    errorElement: <SomethingWrong />
  },
  {
    path: "changeLog",
    element: <Log />,
    errorElement: <SomethingWrong />
  },
]