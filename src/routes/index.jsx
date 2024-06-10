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
import LoadingCustomer from "@/pages/Customer/loading_customer";
import ConnectingCustomer from "@/pages/Customer/Consulting/index";
import ExplainingCustomer from "@/pages/Customer/explaining_customer";
import LoginCustomer from "@/pages/Login/indexCustomer";
import LoginTeller from "@/pages/Login/indexTeller";

import AuthCustomer from "@/pages/Auth/auth_complete";
import Finish from "@/pages/Auth/finish";

import ConnectingTeller from "@/pages/Teller/Consulting/index";

import LoadingTeller from "@/pages/Teller/loading_teller";
import OwnCustomer from "@/pages/Customer/own_customer";

import DailyWorks from '@/pages/Admin/DailyWorks';
import DailyScore from '@/pages/Admin/DailyScore';
import Works from '@/pages/Admin/Works';

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
        path: "consulting/customer/mydata",
        children: [
          { index: true, element: <OwnCustomer /> },
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
        path: "consulting/teller/loading",
        children: [
          { index: true, element: <LoadingTeller /> },
          { path: ":testId", element: <Main /> }
        ]
      },
      {
        path: "consulting/teller/connecting",
        children: [
          { index: true, element: <ConnectingTeller /> },
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
    path: "/login/customer",
    children: [
      { index: true, element: <LoginCustomer /> },
      { path: ":testId", element: <Main /> }
    ]
  },
  {
    path: "/login/teller",
    children: [
      { index: true, element: <LoginTeller /> },
      { path: ":testId", element: <Main /> }
    ]
  },
  {
    path: "/auth/customer",
    children: [
      { index: true, element: <AuthCustomer /> },
      { path: ":testId", element: <Main /> }
    ]
  },
  {
    path: "/auth/mobile/camera",
    element: <Camera />
  },
  {
    path: "/auth/mobile/ocr",
    element: <Auth />
  },
  {
    path: "/auth/mobile/finish",
    element: <Footer />,
    children: [{ index: true, element: <Finish /> }]
  },
  {
    path: "/after/customer",
    children: [
      { index: true, element: <AfterCustomer /> },
      { path: ":testId", element: <Main /> }
    ]
  },
  {
    path: "/after/teller",
    children: [
      { index: true, element: <AfterTeller /> },
      { path: ":testId", element: <Main /> }
    ]
  },
  {
    path: "/admin",
    element: <RootLayout />,
    children: [
      {
        path: "dailyWorks",
        children: [
          { index: true, element: <DailyWorks /> },
          { path: ":testId", element: <Main /> }
        ]
      },
      {
        path: "dailyScore",
        children: [
          { index: true, element: <DailyScore /> },
          { path: ":testId", element: <Main /> }
        ]
      }
    ]
  },{
    path: "/admin/works",     
    children: [
      { index: true, element: <Works /> },
      { path: ":testId", element: <Main /> }
    ]
  },
]);

export default router;
