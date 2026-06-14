import "./PortalLogin.css";

import logo from "../assets/logo.png";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

export default function PortalLogin() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loginData, setLoginData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {

    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });

  };

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response =
        await fetch(
          "https://manjuyod-water-production.up.railway.app/api/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              loginData
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        alert(
          data.message ||
          "Login failed"
        );

        return;

      }

      // SAVE USER
      localStorage.setItem(
        "waterUser",
        JSON.stringify(data.user)
      );

      alert("Login successful");

      navigate(
        "/resident-dashboard"
      );

    }

    catch (error) {

      console.log(error);

      alert("Server Error");

    }

  };

  return (

    <div className="portal-page">

      <div className="portal-container">

        {/* LEFT */}

        <div className="portal-left">

          <img
            src={logo}
            alt="logo"
            className="portal-logo"
          />

          <h4>
            MANJUYOD WATERWORKS
          </h4>

          <h1>
            Reliability
            <br />
            in Every
            <br />
            Drop.
          </h1>

          <p>
            Access your resident account,
            monitor application status,
            manage billing, and connect
            with municipal water services
            online.
          </p>

        </div>

        {/* RIGHT */}

        <div className="portal-right">

          <div className="login-card">

            <img
              src={logo}
              alt="logo"
              className="mobile-logo"
            />

            <h1>
              Welcome Back
            </h1>

            <p className="subtitle">
              Login to continue to your
              resident portal account.
            </p>

            <form
  onSubmit={handleLogin}
  autoComplete="off"
>

              <div className="input-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  autoComplete="off"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="input-group">

                <label>
                  Password
                </label>

                <div className="password-wrapper">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                  />

                  <span
                    className="show-btn"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {
                      showPassword
                        ? "Hide"
                        : "Show"
                    }
                  </span>

                </div>

              </div>

              <button
                type="submit"
                className="login-btn"
              >
                LOGIN
              </button>

            </form>

            <div className="register-link">

              <p>
                No account yet?
              </p>

              <button
                className="apply-btn"
                onClick={() =>
                  navigate(
                    "/application"
                  )
                }
              >
                Begin Application
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}
