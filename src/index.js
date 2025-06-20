import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// REACT ROUTER DOM IMPORT
import { BrowserRouter } from "react-router-dom";

// ** Emotion Imports
import { CacheProvider } from "@emotion/react";

// ** Utils Imports
import { createEmotionCache } from "src/@core/utils/create-emotion-cache";

// ** Contexts
import { AuthProvider } from "src/context/AuthContext";
import {
  SettingsConsumer,
  SettingsProvider,
} from "src/@core/context/settingsContext";
// import { AuthSettingProvider } from "src/context/AppSettingContext";

// ** Component Imports
import ThemeComponent from "./@core/theme/ThemeComponent";

// ** Styled Components
import ReactHotToast from "src/@core/styles/libs/react-hot-toast";

// ** Third Party Import
import { Toaster } from "react-hot-toast";


const emotionCache = createEmotionCache();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
      <CacheProvider value={emotionCache}>
      <BrowserRouter>
        <SettingsProvider>
          <SettingsConsumer>
            {({ settings }) => {
              return (
                <ThemeComponent settings={settings}>
                  <AuthProvider>
                    <App />
                    <ReactHotToast>
                        <Toaster
                          position={settings.toastPosition}
                          toastOptions={{ className: "react-hot-toast" }}
                        />
                      </ReactHotToast>
                  </AuthProvider>
                </ThemeComponent>
              );
            }}
          </SettingsConsumer>
        </SettingsProvider>
      </BrowserRouter>
      </CacheProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
