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
    children: (role !== "LEGACY_ADMIN" && !isTms) || (role !== "LEGACY_USER" && !isTms) || (role === "SUPER" && !isTms) ? [
      {
        path: "/",
        element: <Main />,
        errorElement: <SomethingWrong />,
        children: smtrackChildren,
      }
    ] : [
      {
        path: "/",
        element: <TmsMain />,
        errorElement: <SomethingWrong />,
        children: tmsChildren
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