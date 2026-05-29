import "./ResidentDashboard.css";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import defaultProfile from "../assets/default-profile.png";

import logo from "../assets/logo.png";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

const ResidentDashboard = () => {

  const navigate =
    useNavigate();

  /* =========================
     USER
  ========================= */

  const user =
    JSON.parse(
      localStorage.getItem(
        "waterUser"
      )
    ) || {

      fullName:
        "Resident User",

      email:
        "resident@email.com",

      address:
        "Manjuyod",

    };

  /* =========================
     PROFILE
  ========================= */

  const savedProfile =
    localStorage.getItem(
      "residentProfile"
    );

  const [profileImage, setProfileImage] =
    useState(
      savedProfile ||
      defaultProfile
    );

  const [showDropdown, setShowDropdown] =
    useState(false);

  /* =========================
     BILLING
  ========================= */

  const [bills, setBills] =
    useState([]);

  /* =========================
     FETCH REAL BILLING DATA
  ========================= */

  useEffect(() => {

    if (!user?._id) return;

    fetch(
      `https://manjuyod-water-production.up.railway.app/api/admin/billing/user/${user._id}`
    )

      .then((res) => res.json())

      .then((data) => {

        setBills(data);

      })

      .catch((error) => {

        console.log(error);

      });

  }, []);

  /* =========================
     COMPUTED VALUES
  ========================= */

  const unpaidBills =
    bills.filter(
      (bill) =>
        bill.status !== "Paid"
    );

  const totalUnpaid =
    unpaidBills.reduce(
      (sum, bill) =>
        sum +
        Number(
          bill.amount || 0
        ),
      0
    );

  const totalConsumption =
    bills.reduce(
      (sum, bill) =>
        sum +
        Number(
          bill.consumption || 0
        ),
      0
    );

  const latestBill =
    unpaidBills[0];

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {

    localStorage.clear();

    navigate("/");

  };

  /* =========================
     PROFILE PICTURE
  ========================= */

  const handleProfileUpload = (
    e
  ) => {

    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend = () => {

      localStorage.setItem(
        "residentProfile",
        reader.result
      );

      setProfileImage(
        reader.result
      );

    };

    reader.readAsDataURL(file);

  };

  /* =========================
     CLOSE DROPDOWN
  ========================= */

  useEffect(() => {

    const closeDropdown = () => {

      setShowDropdown(false);

    };

    window.addEventListener(
      "click",
      closeDropdown
    );

    return () => {

      window.removeEventListener(
        "click",
        closeDropdown
      );

    };

  }, []);

  /* =========================
     DOWNLOAD PDF
  ========================= */

  const downloadStatement = () => {

    const doc = new jsPDF();

    doc.setFontSize(22);

    doc.text(
      "Manjuyod Waterworks Statement",
      20,
      20
    );

    doc.setFontSize(12);

    doc.text(
      `Resident: ${user.fullName}`,
      20,
      40
    );

    doc.text(
      `Account Number: ${user.accountNumber}`,
      20,
      50
    );

    doc.text(
      `Generated: ${
        new Date()
          .toLocaleDateString()
      }`,
      20,
      60
    );

    autoTable(doc, {

      startY: 80,

      head: [[
        "Due Date",
        "Consumption",
        "Amount",
        "Status",
      ]],

      body: bills.map(
        (bill) => [

          bill.dueDate
            ?.split("T")[0],

          `${bill.consumption} m³`,

          `₱${bill.amount}`,

          bill.status,

        ]
      ),

    });

    doc.save(
      "water-billing-statement.pdf"
    );

  };

  return (

    <div className="resident-dashboard-page">

      {/* NAVBAR */}

      <header className="top-navbar">

        <div
          className="navbar-brand"
          onClick={() =>
            navigate(
              "/resident-dashboard"
            )
          }
        >

          <img
            src={logo}
            alt="logo"
            className="navbar-logo-image"
          />

          <h2>
            Manjuyod Waterworks
          </h2>

        </div>

        {/* PROFILE */}

        <div
          className="navbar-right"
          onClick={(e) =>
            e.stopPropagation()
          }
        >

          <div
            className="profile-wrapper"
            onClick={() =>
              setShowDropdown(
                !showDropdown
              )
            }
          >

            <img
              src={profileImage}
              alt="profile"
              className="profile-avatar"
            />

            <div className="profile-info">

              <h4>
                {user.fullName}
              </h4>

              <span>
                Resident
              </span>

            </div>

          </div>

          {showDropdown && (

            <div className="profile-dropdown">

              <label className="upload-btn">

                Change Profile Picture

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleProfileUpload
                  }
                  hidden
                />

              </label>

              <button
                className="logout-dropdown"
                onClick={
                  handleLogout
                }
              >
                Logout
              </button>

            </div>

          )}

        </div>

      </header>

      {/* MAIN */}

      <main className="dashboard-main">

        {/* HERO */}

        <section className="hero-card">

          <h1>
            Welcome back
          </h1>

          <p>
            {user.fullName}
          </p>

        </section>

        {/* APPLICATION STATUS */}

        <section className="status-card">

          <div>

            <span className="section-label">

              APPLICATION STATUS

            </span>

            <h2>

              {
                user.connectionType ||
                "Residential Service Connection"
              }

            </h2>

          </div>

          <div className="status-badge">

            {
              user.applicationStatus ||
              "Pending"
            }

          </div>

        </section>

        {/* SUMMARY */}

        <section className="summary-grid">

          <div className="summary-card">

            <span>
              TOTAL BILLS
            </span>

            <h2>
              {bills.length}
            </h2>

          </div>

          <div className="summary-card">

            <span>
              TOTAL CONSUMPTION
            </span>

           <h2>
  {totalConsumption}m³
</h2>

<p className="rate-label">
  ₱25 per m³
</p>

          </div>

          <div className="summary-card">

            <span>
              TOTAL UNPAID
            </span>

            <h2 className="danger-text">

              ₱{totalUnpaid}

            </h2>

          </div>

        </section>

        {/* GRID */}

        <section className="dashboard-grid">

          {/* ACTIVE STATEMENT */}

          <div className="statement-card">

            <div className="statement-top">

              <div>

                <span className="section-label">

                  ACTIVE STATEMENT

                </span>

                <p className="statement-date">

                  Due on{" "}

                  {
                    latestBill?.dueDate ||
                    "No due date"
                  }

                </p>

              </div>

              <span
                className={`bill-status ${
                  latestBill?.status ===
                  "Paid"

                    ? "paid"

                    : "unpaid"
                }`}
              >

                {
                  latestBill?.status ||
                  "No Bill"
                }

              </span>

            </div>

            <h1>

              ₱
              {
                latestBill?.amount || 0
              }

            </h1>

            <p className="balance-label">

              Current Balance

            </p>

            <button
              className="download-btn"
              onClick={
                downloadStatement
              }
            >
              Download Statement
            </button>

            <div className="payment-reminder">

              <h4>
                Payment Reminder
              </h4>

              <p>

                Please settle your unpaid
                balance at the Municipal Hall
                Treasurer’s Office during
                office hours.

              </p>

              <div className="resident-disclaimer">

  <h4>
    Application Concern?
  </h4>

  <p>

    If your application was rejected,
    please visit the Manjuyod Waterworks
    Department for clarification and
    verification of submitted requirements.

  </p>

  <p>

    You may also contact us through:

  </p>

  <ul>

    <li>
      Email:
      manjuyodwaterworks@gmail.com
    </li>

    <li>
      Contact Number:
      0912-345-6789
    </li>

    <li>
      Facebook Messenger:
      Manjuyod Waterworks
    </li>

  </ul>

</div>

            </div>

          </div>

          {/* PAYMENT */}

          <div className="payment-card">

            <span className="section-label light">

              PAYMENT METHOD

            </span>

            <h2>

              Walk-in transactions only

            </h2>

            <p>

              Visit the Municipal Hall
              Treasurer’s Office during office
              hours (8:00 AM - 5:00 PM).

            </p>

            <div className="payment-features">

              <div>
                ✓ Bring your latest statement
              </div>

              <div>
                ✓ Official receipt issued instantly
              </div>

              <div>
                ✓ Cash and Cheque accepted
              </div>

            </div>

          </div>

        </section>

        {/* BILLING */}

        <section className="billing-section">

          <h2>
            Billing Records
          </h2>

          {bills.length === 0 ? (

            <div className="empty-history">

              <div className="empty-icon">

                📄

              </div>

              <h3>

                No billing records yet

              </h3>

              <p>

                Your billing history will
                appear here once your first
                monthly consumption is
                recorded.

              </p>

            </div>

          ) : (

            bills.map(
              (bill) => (

                <div
                  className="history-card"
                  key={bill._id}
                >

                  <div>

                    <span>
                      DUE DATE
                    </span>

                    <h4>
                      {bill.dueDate}
                    </h4>

                  </div>

                  <div>

                    <span>
                      CONSUMPTION
                    </span>

                    <h4>
                      {bill.consumption}m³
                    </h4>

                  </div>

                  <div>

                    <span>
                      AMOUNT
                    </span>

                    <h4>
                      ₱{bill.amount}
                    </h4>

                  </div>

                  <div>

                    <span
                      className={`bill-status ${
                        bill.status ===
                        "Paid"

                          ? "paid"

                          : "unpaid"
                      }`}
                    >

                      {bill.status}

                    </span>

                  </div>

                </div>

              )
            )

          )}

        </section>

      </main>

    </div>

  );

};

export default ResidentDashboard;
