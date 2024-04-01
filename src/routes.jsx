import Layout from "@components/layout";
import EnvCheck from "@pages/EnvCheck";
import ErrorPage from "@pages/ErrorPage";
import BoardDetail from "@pages/board/BoardDetail";
import BoardList from "@pages/board/BoardList";
import BoardNew from "@pages/board/BoardNew";
import ReplyList from "@pages/board/ReplyList";
import Login from "@pages/user/Login";
import Signup from "@pages/user/Signup";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <BoardList />
      },
      {
        path: "boards",
        element: <BoardList />
      },
      {
        path: "boards/:_id",
        element: <BoardDetail />,
        children: [
          {
            index: true,
            element: <ReplyList />
          }
        ]
      },
      {
        path: "boards/new",
        element: <BoardNew />
      },
      {
        path: "users/login",
        element: <Login />
      },
      {
        path: "users/signup",
        element: <Signup />
      },
      {
        path: "envcheck",
        element: <EnvCheck />
      }
    ]
  },
  
]);

export default router;