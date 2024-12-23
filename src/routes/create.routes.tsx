import { createBrowserRouter } from "react-router-dom";
import { AuthRoute } from "../middleware/authprotect";
import Main from "../main/main";
import SomethingWrong from "./something-wrong";
import { smtrackChildren } from "./smtrack.children";
import { tmsChildren } from "./tms.children";
import Policy from "../pages/policy/policy";
import Terms from "../pages/policy/terms";
import Support from "../pages/contact/support";
import { Islogout } from "../authen/authen";
import ErrorPage from "./error-page";
import TmsMain from "../main/tms.main";

export const router = (role: string, isTms: boolean) => createBrowserRouter([
  {
    path: "/",
    element: <AuthRoute />,
    children: [
      {
        path: "/",
        element: role !== "LEGACY_ADMIN" && role !== "LEGACY_USER" && !isTms ? <Main /> : <TmsMain />,
        errorElement: <SomethingWrong />,
        children: role !== "LEGACY_ADMIN" && role !== "LEGACY_USER" && !isTms ? smtrackChildren : tmsChildren,
      },
    ],
  },
  {
    path: "/privacy-policy",
    element: <Policy />
  },
  {
    path: "/terms-conditions",
    element: <Terms />
  },
  {
    path: "/support",
    element: <Support />
  },
  {
    path: "/login",
    element: <Islogout />
  },
  {
    path: "*",
    element: <ErrorPage />
  },
])