import React from "react";
import { createBrowserRouter } from "react-router-dom";

import RootLayout from "@/Layouts/RootLayout/index";
import Main from "@/pages/Main/index";

import Test from "@/pages/Test";
import Consulting from "@/pages/Consulting/Customer";
import Camera from "@/pages/Auth/camera";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import Footer from "@/Layouts/Footer";
import Login from "@/pages/Login";
import AfterTeller from "@/pages/After/index_teller";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,

    children: [
      { index: true, element: <Main /> },
      // {
      //   path: "consulting",
      //   children: [
      //     { index: true, element: <Consulting /> },
      //     { path: ":testId", element: <Main /> }
      //   ]
      // },
      {
        path: "login",     
        children: [
          { index: true, element: <Login /> },
          { path: ":testId", element: <Main /> }
        ]
      },
      {
        path: "afterTeller",     
        children: [
          { index: true, element: <AfterTeller /> },
          { path: ":testId", element: <Main /> }
        ]
      },
      {
        path: "test",
        children: [
          { index: true, element: <Test /> },
          { path: ":testId", element: <Main /> }
        ]
      }
    ]
  },
  {
    path: "/home",
    element: <Footer />,
    children: [{ index: true, element: <Home /> }]
  },  
  {
    path: "/camera",
    element: <Camera />
  },
  {
    path: "/auth",
    element: <Auth />
  }
]);

export default router;
