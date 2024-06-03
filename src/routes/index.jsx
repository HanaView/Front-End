import React from "react";
import { createBrowserRouter } from "react-router-dom";

import RootLayout from "@/Layouts/RootLayout/index";
import Main from "@/pages/Main/index";

import Test from "@/pages/Test";
import Camera from "@/pages/Auth/camera";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import Footer from "@/Layouts/Footer";

import AfterTeller from "@/pages/After/index_teller";
import AfterCustomer from "@/pages/After/index_customer";
import Finish from "@/pages/Auth/finish";
import LoadingCustomer from "@/pages/Consulting/Customer/loading_customer";
import ConnectingCustomer from "@/pages/Consulting/Customer/connecting_customer";
import ExplainingCustomer from "@/pages/Consulting/Customer/explaining_customer";
import LoginCustomer from "@/pages/Login/indexCustomer";
import LoginTeller from "@/pages/Login/indexTeller";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Footer />,
    children: [{ index: true, element: <Home /> }]
  },  
  {
    path: "/",
    element: <RootLayout />,

    children: [      
      {
        path: "consulting/customer/loading",
        children: [
          { index: true, element: <LoadingCustomer /> },
          { path: ":testId", element: <Main /> }
        ]
      },
      {
        path: "consulting/customer/explaining",
        children: [
          { index: true, element: <ExplainingCustomer /> },
          { path: ":testId", element: <Main /> }
        ]
      },
      {
        path: "consulting/customer/connecting",
        children: [
          { index: true, element: <ConnectingCustomer /> },
          { path: ":testId", element: <Main /> }
        ]
      },
      {
        path: "login/customer",     
        children: [
          { index: true, element: <LoginCustomer /> },
          { path: ":testId", element: <Main /> }
        ]
      },
      {
        path: "login/teller",     
        children: [
          { index: true, element: <LoginTeller /> },
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
