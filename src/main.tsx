import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="min-h-dvh max-w-2xl mx-auto px-6 pt-4 flex flex-col ">
      <App />
    </main>
  </StrictMode>,
);
