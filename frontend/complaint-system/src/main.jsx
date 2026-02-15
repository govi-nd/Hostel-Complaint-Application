import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import "./App.css";

const root = createRoot(document.getElementById("root"));

root.render(
 <App/>
);
