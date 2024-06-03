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


import AfterTeller from "@/pages/After/index_teller";
import AfterCustomer from "@/pages/After/index_customer";
import Finish from "@/pages/Auth/finish";
import Login from "@/pages/Login/indexCustomer";
import ConsultingTeller from "@/pages/Consulting/Teller";
import LoadingCustomer from "@/pages/Consulting/Customer/loading_customer";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Main /> },
      {
        path: "consulting/customer/loading",
        children: [
<<<<<<< HEAD
          { path: "customer", element: <Customer /> },
          { path: "teller", element: <Teller /> },
=======
          { index: true, element: <LoadingCustomer /> },
          { path: ":testId", element: <Main /> }
        ]
      },
      {
        path: "login/customer",     
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
        path: "afterCustomer",     
        children: [
          { index: true, element: <AfterCustomer /> },
          { path: ":testId", element: <Main /> }
>>>>>>> develop
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
  },
  {
    path: "/authfinish",
    element: <Footer />,
    children: [{ index: true, element: <Finish /> }]
  },  
]);

export default router;
