import React from "react";
import { useState } from "react";
import { createBrowserRouter } from "react-router-dom";

import RootLayout from "@/Layouts/RootLayout/index";
import Main from "@/pages/Main/index";

import Test from "@/pages/Test";
import Consulting from "@/pages/Consulting";
import Camera from "@/pages/Auth/camera";
import Auth from "@/pages/Auth";


const router = createBrowserRouter([
  {  
    path: "/",
    element: <RootLayout />,
    
    children: [
      { index: true, element: <Main /> },
      {
        path: "consulting",
        children: [
          { index: true, element: <Consulting /> },
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
    element: <Auth/>    
  }
]);

export default router;
