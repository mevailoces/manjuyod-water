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
          "http://localhost:5000/api/admin-login",
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

        navigate(
          "/admin-dashboard"
        );

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
          >

            <input
              type="email"
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
