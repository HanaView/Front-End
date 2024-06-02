import React from "react";
import { createBrowserRouter } from "react-router-dom";

import RootLayout from "@/Layouts/RootLayout/index";
import Main from "@/pages/Main/index";

import Test from "@/pages/Test";
import Customer from "@/pages/Consulting/Customer";
import Teller from "@/pages/Consulting/Teller";

import Camera from "@/pages/Auth/camera";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import Footer from "@/Layouts/Footer";
import ConsultVideo from "@/components/Video";



const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Main /> },
      {
        path: "consulting",
        children: [
          { path: "customer", element: <Customer /> },
          { path: "teller", element: <Teller /> },
        ]
      },
      {
        path: "test",
        element: <Test />
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
