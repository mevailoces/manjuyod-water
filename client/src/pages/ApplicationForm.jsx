import "./ApplicationForm.css";

import { useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import logo from "../assets/logo.png";

function ApplicationForm() {

  const navigate =
    useNavigate();

  const [fullName, setFullName] =
    useState("");

  const [
    contactNumber,
    setContactNumber,
  ] = useState("");

  const [email, setEmail] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [landmark, setLandmark] =
    useState("");

  const [
    connectionType,
    setConnectionType,
  ] = useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [validId, setValidId] =
    useState(null);

  const [agreeMOA, setAgreeMOA] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (loading) return;

      // VALIDATION
      if (
        password !==
        confirmPassword
      ) {

        alert(
          "Passwords do not match"
        );

        return;

      }

      if (!validId) {

        alert(
          "Please upload a valid ID."
        );

        return;

      }

      if (!agreeMOA) {

        alert(
          "Please agree to the Memorandum of Agreement."
        );

        return;

      }

      try {

        setLoading(true);

        const submitData =
          new FormData();

        submitData.append(
          "fullName",
          fullName
        );

        submitData.append(
          "contactNumber",
          contactNumber
        );

        submitData.append(
          "email",
          email
        );

        submitData.append(
          "address",
          address
        );

        submitData.append(
          "landmark",
          landmark
        );

        submitData.append(
          "connectionType",
          connectionType
        );

        submitData.append(
          "password",
          password
        );

        submitData.append(
          "validId",
          validId
        );

        console.log(
          "Submitting application..."
        );

        const response =
          await fetch(
            "https://manjuyod-water-production.up.railway.app/api/register",
            {
              method: "POST",
              body: submitData,
            }
          );

        const data =
          await response.json();

        console.log(data);

        // SUCCESS
        if (response.ok) {

          alert(
            data.message ||
            "Application submitted successfully!"
          );

          // RESET FORM
          setFullName("");
          setContactNumber("");
          setEmail("");
          setAddress("");
          setLandmark("");
          setConnectionType("");
          setPassword("");
          setConfirmPassword("");
          setValidId(null);
          setAgreeMOA(false);

          // REDIRECT
          navigate("/portal", {
            replace: true,
          });

          return;

        }

        // FAILED
        alert(
          data.message ||
          "Registration failed."
        );

      }

      catch (error) {

        console.log(error);

        alert(
          "Server error. Please check backend."
        );

      }

      finally {

        setLoading(false);

      }

    };

  return (

    <div className="application-page">

      <div className="application-card">

        <img
          src={logo}
          alt="logo"
          className="application-logo"
        />

        <h1>
          Begin Your Application
        </h1>

        <form
          onSubmit={handleSubmit}
          noValidate
        >

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) =>
              setFullName(
                e.target.value
              )
            }
            required
          />

          <input
            type="text"
            placeholder="Contact Number"
            value={contactNumber}
            onChange={(e) =>
              setContactNumber(
                e.target.value
              )
            }
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            required
          />

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) =>
              setAddress(
                e.target.value
              )
            }
            required
          />

          <input
            type="text"
            placeholder="Nearest Landmark"
            value={landmark}
            onChange={(e) =>
              setLandmark(
                e.target.value
              )
            }
          />

          <select
            value={connectionType}
            onChange={(e) =>
              setConnectionType(
                e.target.value
              )
            }
            required
          >

            <option value="">
              Select Connection Type
            </option>

            <option value="Residential">
              Residential
            </option>

            <option value="Commercial">
              Commercial
            </option>

          </select>

          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            required
          />

          <div className="upload-label">

            Upload / Submit Valid ID Picture

          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setValidId(
                e.target.files[0]
              )
            }
          />

          <div className="moa-box">

            <h3>
              MEMORANDUM OF AGREEMENT
            </h3>

            <p>
              Application is hereby made for water services to be supplied by the
              Manjuyod Waterworks Department to the water Consumer in accordance
              with the existing local and national laws and its IRR, now in force
              or may be in force thereafter.
            </p>

            <p>
              In addition, I hereby agree to abide by the rules and regulations
              provided in Municipal Ordinance No. 019 and the Water Code of the
              Philippines, pay monthly bills within ten (10) days from receipt,
              notify the proper offices for ownership transfer or service
              discontinuance, allow authorized representatives to perform their
              duties, maintain the water meter, avoid flying connections and
              electric driven pumps directly from the main pipeline, and comply
              with all terms of the water service agreement.
            </p>

            <label className="agree-checkbox">

              <input
                type="checkbox"
                checked={agreeMOA}
                onChange={(e) =>
                  setAgreeMOA(
                    e.target.checked
                  )
                }
              />

              I have read and agree to
              the Memorandum of
              Agreement.

            </label>

          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >

            {
              loading
                ? "Submitting..."
                : "Submit Application"
            }

          </button>

        </form>

      </div>

    </div>

  );

}

export default ApplicationForm;
