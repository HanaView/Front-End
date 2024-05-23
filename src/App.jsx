import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@/common/styles/scss/base.scss";
import { Provider } from "jotai";
import router from "./routes";
import GlobalModal from "@/components/Modal";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider>
          <ReactQueryDevtools initialIsOpen={false} />
          <RouterProvider router={router} />
          <GlobalModal />
        </Provider>
      </QueryClientProvider>
    </>
  );
}

export default App;
