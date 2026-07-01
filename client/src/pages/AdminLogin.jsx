import "./AdminLogin.css";
import logo from "../assets/logo.png";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response =
        await fetch(
          "https://manjuyod-water-production.up.railway.app/api/admin-login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (response.ok) {

        alert(data.message);

        localStorage.setItem(
  "admin",
  JSON.stringify(data.admin)
);

if (
  data.admin.role === "cashier" ||
  data.admin.role === "meterReader"
) {
  navigate("/billing");
} else {
  navigate("/admin-dashboard");
}

      } else {

        alert(data.message);

      }

    } catch {

      alert("Server Error");

    }

  };

  return (

    <div className="admin-page">


      <div className="admin-container">

        <div className="admin-left">

          <img
            src={logo}
            alt="logo"
            className="admin-logo"
          />

          <h1>
            MANJUYOD WATERWORKS
          </h1>

          <p>
            Municipal Waterworks
            Administration System
          </p>

        </div>

        <div className="admin-right">

          <h1>
            Administrator Login
          </h1>

          <form
  onSubmit={handleLogin}
  autoComplete="off"
>

            <input
              type="email"
              autoComplete="off"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
            />

            <input
              type="password"
  autoComplete="new-password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
            />

            <button
              type="submit"
            >
              LOGIN
            </button>

          </form>

        </div>

      </div>

    </div>

  );

}
