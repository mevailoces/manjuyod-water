import "./ApplicationForm.css";

import { useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import logo from "../assets/logo.png";
import Select from "react-select";

function ApplicationForm() {

  const navigate =
    useNavigate();

    const barangayOptions = [
  { value: "Alangilanan", label: "Alangilanan" },
  { value: "Bala-as", label: "Bala-as" },
  { value: "Bantolinao", label: "Bantolinao" },
  { value: "Bolisong", label: "Bolisong" },
  { value: "Butong", label: "Butong" },
  { value: "Concepcion", label: "Concepcion" },
  { value: "Libjo", label: "Libjo" },
  { value: "Limayag", label: "Limayag" },
  { value: "Lower Libjo", label: "Lower Libjo" },
  { value: "Mandalupang", label: "Mandalupang" },
  { value: "Poblacion", label: "Poblacion" },
  { value: "Sac-Sac", label: "Sac-Sac" },
  { value: "Salvacion", label: "Salvacion" },
  { value: "San Isidro", label: "San Isidro" },
  { value: "Sta. Monica", label: "Sta. Monica" },
  { value: "Suba", label: "Suba" },
  { value: "Sundo-an", label: "Sundo-an" },
  { value: "Tubod", label: "Tubod" },
  { value: "Tupas", label: "Tupas" },
  { value: "Upper Bolisong", label: "Upper Bolisong" },
  { value: "Upper Salvacion", label: "Upper Salvacion" },
  { value: "Upper Sundo-an", label: "Upper Sundo-an" },
];




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

/* VALIDATE BARANGAY */

if (!address) {

  alert(
    "Please select a barangay."
  );

  return;

}

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
  autoComplete="off"
  data-form-type="other"
>
<div className="form-group">
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
          /> </div>

<div className="form-group">
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
          </div>

<div className="form-group">
          <input
  type="text"
  name="application_email"
  placeholder="Email Address"
  value={email}
  autoComplete="new-email"
  spellCheck="false"
  onChange={(e) =>
    setEmail(e.target.value)
  }
  required
/>
</div>


<div className="form-group">
  <input
  type="text"
  list="barangays"
  placeholder="Search or select barangay..."
  value={address}
  onChange={(e) =>
    setAddress(e.target.value)
  }
  required
/>

<datalist id="barangays">
  {barangayOptions.map((barangay) => (
    <option
      key={barangay.value}
      value={barangay.value}
    />
  ))}
</datalist>
</div>

<div className="form-group">
          <input
            type="text"
            placeholder="Nearest Landmark"
            value={landmark}
            onChange={(e) =>
              setLandmark(
                e.target.value
              )
            }
          /> </div>
          <div className="upload-label-note">

           <i>Note in typing for nearest landmark: Type <b>None</b> or <b>N/A</b> if not applicable</i>

          </div>
<div className="form-group">
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

          </select> </div>

          <div className="form-group">

          <input
  type="password"
  name="new_application_password"
  autoComplete="new-password"
  placeholder="Create Password"
  value={password}
  onChange={(e) =>
    setPassword(e.target.value)
  }
  required
/>
</div>
          <div className="form-group"><input
  type="password"
  name="confirm_application_password"
  autoComplete="new-password"
  placeholder="Confirm Password"
  value={confirmPassword}
  onChange={(e) =>
    setConfirmPassword(e.target.value)
  }
  required
/></div>


          <div className="upload-label">

            Upload / Submit Valid ID Picture

          </div>
<div className="form-group">
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setValidId(
                e.target.files[0]
              )
            }
          />
</div>
          <div className="agreement-section">

  <label className="agree-checkbox">

    <input
      type="checkbox"
      checked={agreeMOA}
      onChange={(e) =>
        setAgreeMOA(e.target.checked)
      }
    />

    <span>
      I have read and agree to the{" "}
      <span className="moa-tooltip">

        Memorandum of Agreement

        <span className="tooltip-content">

          <strong>
            Memorandum of Agreement
          </strong>

          <ul>
            <li>
              Water service shall comply with
              applicable local and national laws.
            </li>

            <li>
              Consumers must comply with
              Municipal Ordinance No. 019 and
              the Water Code of the Philippines.
            </li>

            <li>
              Monthly bills must be paid within
              ten (10) days from receipt.
            </li>

            <li>
              Authorized personnel may inspect
              and maintain water service
              facilities.
            </li>

            <li>
              Consumers shall avoid unauthorized
              connections and prohibited
              practices.
            </li>

          </ul>

        </span>

      </span>
    </span>

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
