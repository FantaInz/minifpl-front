import * as React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@/utils/i18n";
import { App } from "./app";

createRoot(document.getElementById("root")).render(<App />);
