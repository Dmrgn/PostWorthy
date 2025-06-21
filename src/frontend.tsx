import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import LandingPage from "./components/landing";

const container = document.getElementById("root");
const root = createRoot(container!);

const path = window.location.pathname;

if (path === "/app") {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <LandingPage />
    </React.StrictMode>
  );
}
