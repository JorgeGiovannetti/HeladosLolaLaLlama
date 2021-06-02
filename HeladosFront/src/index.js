import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { RecoilRoot } from "recoil";
import { ChakraProvider } from "@chakra-ui/react";
import AuthProvider from "./utils/providers/AuthProvider";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
