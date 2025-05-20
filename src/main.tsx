import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/zen-mode.css";
import "./styles/theme-extensions.css";
import { TempoDevtools } from "tempo-devtools";

// Initialize Tempo Devtools if running in Tempo environment
if (import.meta.env.DEV) {
  TempoDevtools.init();
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
