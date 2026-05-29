import "./AdminDashboard.css";

import {
  useEffect,
  useState,
} from "react";

function Applications() {

  const [applications, setApplications] =
    useState([]);

  useEffect(() => {

    fetchApplications();

  }, []);

  const getValue =
    (app, keys, fallback = "") => {

      for (const key of keys) {

        if (
          app?.[key] !== undefined &&
          app?.[key] !== null &&
          app?.[key] !== ""
        ) {

          return app[key];

        }

      }

      return fallback;

    };

  const escapeHtml =
    (value) =>
      String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

  const formatDate =
    (value) => {

      if (!value) return "";

      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {

        return value;

      }

      return date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    };

  const fetchApplications = async () => {

    try {

      const response =
        await fetch(
          "http://localhost:5000/api/admin/users"
        );

      const data =
        await response.json();

      setApplications(
        Array.isArray(data) ? data : []
      );

    } catch (error) {

      console.log(error);

      alert(
        "Failed to load applications"
      );

    }

  };

  const updateApplicationStatus =
    async (id, status) => {

      try {

        const response =
          await fetch(
            `http://localhost:5000/api/admin/status/${id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          alert(
            data.message ||
            "Failed to update status"
          );

          return;

        }

        alert(`Application ${status}`);

        fetchApplications();

      } catch (error) {

        console.log(error);

        alert(
          "Failed to update application status"
        );

      }

    };

  const approveApplication =
    (id) => {

      updateApplicationStatus(
        id,
        "Approved"
      );

    };

  const rejectApplication =
    (id) => {

      updateApplicationStatus(
        id,
        "Rejected"
      );

    };

  const handleView =
    (app) => {

      alert(`
Name: ${getValue(app, ["fullName", "full_name"])}

Email: ${getValue(app, ["email"])}

Contact: ${getValue(app, ["contactNumber", "contact_number"])}

Address: ${getValue(app, ["address"])}

Landmark: ${getValue(app, ["landmark"])}

Connection Type: ${getValue(app, ["connectionType", "connection_type"])}
      `);

    };

  const getInstallationDetails =
    () => ({
      installationFee:
        prompt("Installation Fee:", "") || "",
      orNumber:
        prompt("O.R. No.:", "") || "",
      orDate:
        prompt("O.R. Date:", "") || "",
      waterMeterMake:
        prompt("Water Meter Make:", "") || "",
      serialNo:
        prompt("Serial No.:", "") || "",
      dateTested:
        prompt("Date Tested:", "") || "",
      initialReading:
        prompt("Initial Reading:", "") || "",
      dateInstalled:
        prompt("Date Installed:", "") || "",
      installedBy:
        prompt("Installed By:", "") || "",
      remarks:
        prompt("Remarks:", "") || "",
    });

  const printApplication =
    (app) => {

      const installation =
        getInstallationDetails();

      const fullName =
        getValue(app, ["fullName", "full_name"]);

      const contactNumber =
        getValue(app, ["contactNumber", "contact_number"]);

      const connectionType =
        getValue(app, ["connectionType", "connection_type"]);

      const applicationStatus =
        getValue(app, ["applicationStatus", "status"], "Pending");

      const printWindow =
        window.open(
          "",
          "",
          "width=900,height=1000"
        );

      if (!printWindow) {

        alert(
          "Please allow popups."
        );

        return;

      }

      printWindow.document.write(`
<html>

<head>

<title>
Application and Memorandum of Agreement
</title>

<style>

@page{
  size:A4;
  margin:14mm;
}

*{
  box-sizing:border-box;
}

body{
  font-family:Arial, Helvetica, sans-serif;
  color:#111827;
  margin:0;
  background:#ffffff;
  font-size:12px;
  line-height:1.45;
}

.print-page{
  width:100%;
}

.header{
  text-align:center;
  margin-bottom:18px;
}

.header h1{
  margin:0;
  font-size:19px;
  letter-spacing:.5px;
  color:#111827;
}

.header h2{
  margin:4px 0 0;
  font-size:15px;
  font-weight:700;
}

.header p{
  margin:2px 0;
  font-size:11px;
}

.section-title{
  text-align:center;
  font-weight:700;
  font-size:15px;
  margin:18px 0 10px;
  text-transform:uppercase;
}

.info-grid{
  display:grid;
  grid-template-columns:repeat(2, 1fr);
  gap:8px 18px;
  margin-bottom:16px;
}

.info-item{
  display:flex;
  gap:6px;
}

.info-label{
  font-weight:700;
  min-width:110px;
}

.line-value{
  flex:1;
  border-bottom:1px solid #111827;
  min-height:18px;
  padding:0 4px;
}

.moa p{
  margin:0 0 10px;
  text-align:justify;
}

.moa ol{
  margin:8px 0 0 20px;
  padding:0;
}

.moa li{
  margin-bottom:7px;
  text-align:justify;
}

.signature-grid{
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:20px;
  margin-top:36px;
  text-align:center;
}

.signature-box{
  min-height:58px;
}

.signature-line{
  border-top:1px solid #111827;
  padding-top:4px;
  font-weight:700;
  min-height:20px;
}

.signature-title{
  font-size:11px;
}

.approved-box{
  margin:26px auto 10px;
  width:260px;
  text-align:center;
}

.installation-section{
  margin-top:18px;
  border-top:2px solid #111827;
  padding-top:10px;
}

.installation-title{
  font-weight:700;
  text-transform:uppercase;
  margin-bottom:8px;
}

.installation-row{
  display:grid;
  grid-template-columns:120px 1fr 70px 1fr 50px 1fr;
  gap:6px;
  align-items:end;
  margin-bottom:8px;
}

.installation-grid{
  display:grid;
  grid-template-columns:150px 1fr;
  gap:7px 8px;
  margin-top:8px;
}

.installation-label{
  font-weight:700;
}

.installation-value{
  border-bottom:1px solid #111827;
  min-height:18px;
  padding:0 4px;
}

.footer-note{
  margin-top:14px;
  font-size:10px;
  color:#374151;
}

@media print{
  body{
    -webkit-print-color-adjust:exact;
    print-color-adjust:exact;
  }

  .no-print{
    display:none;
  }
}

</style>

</head>

<body>

<div class="print-page">

  <div class="header">
    <p>Republic of the Philippines</p>
    <p>Province of Negros Oriental</p>
    <h1>MUNICIPALITY OF MANJUYOD</h1>
    <h2>MANJUYOD WATERWORKS DEPARTMENT</h2>
    <p>Water Service Application and Memorandum of Agreement</p>
  </div>

  <div class="section-title">
    Personal Information
  </div>

  <div class="info-grid">
    <div class="info-item">
      <span class="info-label">Full Name:</span>
      <span class="line-value">${escapeHtml(fullName)}</span>
    </div>

    <div class="info-item">
      <span class="info-label">Account No.:</span>
      <span class="line-value">${escapeHtml(getValue(app, ["accountNumber"]))}</span>
    </div>

    <div class="info-item">
      <span class="info-label">Email:</span>
      <span class="line-value">${escapeHtml(getValue(app, ["email"]))}</span>
    </div>

    <div class="info-item">
      <span class="info-label">Contact No.:</span>
      <span class="line-value">${escapeHtml(contactNumber)}</span>
    </div>

    <div class="info-item">
      <span class="info-label">Address:</span>
      <span class="line-value">${escapeHtml(getValue(app, ["address"]))}</span>
    </div>

    <div class="info-item">
      <span class="info-label">Landmark:</span>
      <span class="line-value">${escapeHtml(getValue(app, ["landmark"]))}</span>
    </div>

    <div class="info-item">
      <span class="info-label">Connection Type:</span>
      <span class="line-value">${escapeHtml(connectionType)}</span>
    </div>

    <div class="info-item">
      <span class="info-label">Status:</span>
      <span class="line-value">${escapeHtml(applicationStatus)}</span>
    </div>

    <div class="info-item">
      <span class="info-label">Date Submitted:</span>
      <span class="line-value">${escapeHtml(formatDate(getValue(app, ["createdAt"])))}</span>
    </div>
  </div>

  <div class="section-title">
    Memorandum of Agreement
  </div>

  <div class="moa">
    <p>
      Application is hereby made for water services to be supplied by the Manjuyod Waterworks Department to the water Consumer in accordance with the existing local and national laws and its IRR, now in force or may be in force thereafter.
    </p>

    <p>
      In addition, I hereby agree:
    </p>

    <ol>
      <li>To abide all the rules and regulations as water Consumer provided in the Municipal Ordinance No. 019, and of the Water Code of the Philippines.</li>
      <li>To pay my monthly bill to the Municipal Treasurer's Office for the water services furnished within ten (10) days from receipt thereof;</li>
      <li>To notify in writing the Municipal Waterworks Department and the Municipal Treasurer's Office when the Consumer transfers the ownership of the property;</li>
      <li>To notify in writing the Municipal Waterworks Department and the Municipal Treasurer's Office when the Consumer wants to discontinue the services of water for proper settlement of account and disconnection;</li>
      <li>Representative/s of Manjuyod Waterworks Department are hereby given free access to enable them to perform their official duties;</li>
      <li>That I will be responsible for the functionality and readability of my water meter. Failure to do so, the Manjuyod Waterworks Department is authorized to discontinue the services of water;</li>
      <li>That I will not allow flying connection at all times;</li>
      <li>That I will not allow the use of electric driven pump directly from main pipeline;</li>
      <li>That the house/building owner, guarantee and assume responsibility of all water and/or other account incurred in connection with said water service upon default of obligation by the above-mentioned applicant;</li>
      <li>That the Manjuyod Waterworks Department shall be permitted for the interruption of the service due to the causes beyond control and may disconnect the services upon violation of the terms of the contract, or when the Manjuyod Waterworks Department has reasonable grounds to believe that the Consumer is using water in violation to the existing rules and regulations;</li>
      <li>That this AGREEMENT shall not be binding unless it is signed by the applicant, the property-owner and approved by the Municipal Mayor or by his duly authorized representative.</li>
    </ol>
  </div>

  <div class="signature-grid">
    <div class="signature-box">
      <div class="signature-line">${escapeHtml(fullName)}</div>
      <div class="signature-title">Applicant / Consumer</div>
    </div>

    <div class="signature-box">
      <div class="signature-line">&nbsp;</div>
      <div class="signature-title">Property Owner</div>
    </div>

    <div class="signature-box">
      <div class="signature-line">ERWIN D. QUE</div>
      <div class="signature-title">OIC - Waterworks Department</div>
    </div>
  </div>

  <div class="signature-grid">
    <div class="signature-box">
      <div class="signature-line">DANILO F. CADALSO</div>
      <div class="signature-title">MPDC</div>
    </div>

    <div class="signature-box"></div>

    <div class="signature-box">
      <div class="signature-line">&nbsp;</div>
      <div class="signature-title">Witness</div>
    </div>
  </div>

  <div class="approved-box">
    <div>Approved:</div>
    <br />
    <div class="signature-line">RAFFY ALIPIO S. ANDAYA J.D.</div>
    <div class="signature-title">Municipal Mayor</div>
  </div>

  <div class="installation-section">
    <div class="installation-title">
      Installation Details
    </div>

    <div class="installation-row">
      <div class="installation-label">Installation Fee</div>
      <div class="installation-value">${escapeHtml(installation.installationFee)}</div>
      <div class="installation-label">O.R No.</div>
      <div class="installation-value">${escapeHtml(installation.orNumber)}</div>
      <div class="installation-label">Date</div>
      <div class="installation-value">${escapeHtml(installation.orDate)}</div>
    </div>

    <div class="installation-grid">
      <div class="installation-label">Water Meter Make</div>
      <div class="installation-value">${escapeHtml(installation.waterMeterMake)}</div>

      <div class="installation-label">Serial No.</div>
      <div class="installation-value">${escapeHtml(installation.serialNo)}</div>

      <div class="installation-label">Date Tested</div>
      <div class="installation-value">${escapeHtml(installation.dateTested)}</div>

      <div class="installation-label">Initial Reading</div>
      <div class="installation-value">${escapeHtml(installation.initialReading)}</div>

      <div class="installation-label">Date Installed</div>
      <div class="installation-value">${escapeHtml(installation.dateInstalled)}</div>

      <div class="installation-label">Installed By</div>
      <div class="installation-value">${escapeHtml(installation.installedBy)}</div>

      <div class="installation-label">Remarks</div>
      <div class="installation-value">${escapeHtml(installation.remarks)}</div>
    </div>
  </div>

  <div class="footer-note">
    This document was generated from the submitted water service application record.
  </div>

</div>

</body>

</html>
      `);

      printWindow.document.close();

      printWindow.focus();

      setTimeout(() => {

        printWindow.print();

      }, 500);

    };

  return (

    <div className="applications-table">

      <table>

        <thead>

          <tr>

            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Landmark</th>
            <th>Status</th>
            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {

            applications.length > 0 ? (

              applications.map((app) => {

                const status =
                  getValue(app, ["applicationStatus", "status"], "Pending");

                return (

                <tr key={app._id}>

                  <td>
                    {getValue(app, ["fullName", "full_name"])}
                  </td>

                  <td>
                    {getValue(app, ["email"])}
                  </td>

                  <td>
                    {getValue(app, ["contactNumber", "contact_number"])}
                  </td>

                  <td>
                    {getValue(app, ["address"])}
                  </td>

                  <td>
                    {getValue(app, ["landmark"])}
                  </td>

                  <td>

                    <span
                      className={`status-badge ${status.toLowerCase()}`}
                    >

                      {status}

                    </span>

                  </td>

                  <td>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >

                      {/* VIEW */}

                      <button
                        onClick={() =>
                          handleView(app)
                        }
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "12px",
                          border: "none",
                          background: "#eff6ff",
                          cursor: "pointer",
                          fontSize: "20px",
                        }}
                      >

                        👁

                      </button>

                      {/* PRINT */}

                      <button
                        onClick={() =>
                          printApplication(app)
                        }
                        title="Print application and Memorandum of Agreement"
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "12px",
                          border: "3px solid red",
                          background: "black",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "20px",
                        }}
                      >

                        🖨

                      </button>

                      {/* APPROVE */}

                      <button
                        onClick={() =>
                          approveApplication(app._id)
                        }
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "12px",
                          border: "none",
                          background: "#dcfce7",
                          color: "#16a34a",
                          cursor: "pointer",
                          fontSize: "20px",
                        }}
                      >

                        ✓

                      </button>

                      {/* REJECT */}

                      <button
                        onClick={() =>
                          rejectApplication(app._id)
                        }
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "12px",
                          border: "none",
                          background: "#fee2e2",
                          color: "#dc2626",
                          cursor: "pointer",
                          fontSize: "20px",
                        }}
                      >

                        ✕

                      </button>

                    </div>

                  </td>

                </tr>

                );

              })

            ) : (

              <tr>

                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >

                  No applications found

                </td>

              </tr>

            )

          }

        </tbody>

      </table>

    </div>

  );

}

export default Applications;
