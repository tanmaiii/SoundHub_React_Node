import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Provider } from "react-redux";
import store from "./store";
import { AudioContextProvider } from "./context/AudioContext";
import { AuthContextProvider } from "./context/AuthContext";

import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <AuthContextProvider>
        <AudioContextProvider>
          <App />
        </AudioContextProvider>
      </AuthContextProvider>
    </Provider>
  </QueryClientProvider>
);
