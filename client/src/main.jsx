import "@fontsource/inter";
import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import App from "./App";

import ApplicationForm
from "./pages/ApplicationForm";

import PortalLogin
from "./pages/PortalLogin";

import AdminLogin
from "./pages/AdminLogin";

import ResidentDashboard
from "./pages/ResidentDashboard";

import AdminDashboard
from "./pages/AdminDashboard";

import Applications
from "./pages/Applications";

import ConsumerRecords
from "./pages/ConsumerRecords";

import Billing
from "./pages/Billing";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<App />}
        />

        <Route
          path="/application"
          element={<ApplicationForm />}
        />

        <Route
          path="/portal"
          element={<PortalLogin />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/resident-dashboard"
          element={<ResidentDashboard />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/applications"
          element={<Applications />}
        />

        <Route
          path="/consumer-records"
          element={<ConsumerRecords />}
        />

        <Route
  path="/billing"
  element={<Billing />}
/>

      </Routes>

    </BrowserRouter>

  </React.StrictMode>

);
