import { Suspense } from "react";
import { HashRouter } from "react-router-dom";
import { Router } from "@/router";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/hooks/useAuth";
import { ChakraProvider } from "@chakra-ui/react";

import "react-toastify/dist/ReactToastify.css";
import "@/assets/css/index.css";

export const App = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <ChakraProvider>
          <Suspense fallback="loading...">
            <Router />
          </Suspense>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            pauseOnHover
            closeButton
          />
        </ChakraProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
