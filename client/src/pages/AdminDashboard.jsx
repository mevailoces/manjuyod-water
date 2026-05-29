import "./AdminDashboard.css";

import logo from "../assets/logo.png";

import {
  Users,
  FileText,
  Receipt,
  Bell,
  Search,
  LogOut,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

function AdminDashboard() {

  const navigate =
    useNavigate();

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [notifications, setNotifications] =
    useState([]);

  const [showNotifications, setShowNotifications] =
  useState(false);

const notificationRef =
  useRef(null);

useEffect(() => {

  const handleClickOutside =
    (event) => {

      if (

        notificationRef.current &&

        !notificationRef.current.contains(
          event.target
        )

      ) {

        setShowNotifications(false);

      }

    };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {

    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );

  };

}, []);
  useEffect(() => {

    fetchUsers();

    fetchNotifications();

  }, []);

  const fetchUsers =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/api/admin/users"
          );

        setUsers(res.data);

      }

      catch (error) {

        console.log(error);

      }

      finally {

        setLoading(false);

      }

    };

  const fetchNotifications =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/api/admin/notifications"
          );

        setNotifications(res.data);

      }

      catch (error) {

        console.log(error);

      }

    };

  const updateStatus =
    async (id, status) => {

      try {

        await axios.put(
          `http://localhost:5000/api/admin/status/${id}`,
          { status }
        );

        fetchUsers();

        fetchNotifications();

      }

      catch (error) {

        console.log(error);

      }

    };

  const deleteUser =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this application?"
        );

      if (!confirmDelete) return;

      try {

        await axios.delete(
          `http://localhost:5000/api/admin/user/${id}`
        );

        fetchUsers();

      }

      catch (error) {

        console.log(error);

      }

    };

  const escapeHtml =
    (value) =>
      String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

  const printApplication =
    (user) => {

      const installationFee =
        prompt("Installation Fee:", "") || "";

      const orNumber =
        prompt("O.R Number:", "") || "";

      const waterMeterMake =
        prompt("Water Meter Make:", "") || "";

      const serialNo =
        prompt("Serial Number:", "") || "";

      const initialReading =
        prompt("Initial Reading:", "") || "";

      const installedBy =
        prompt("Installed By:", "") || "";

      const remarks =
        prompt("Remarks:", "") || "";

      const printWindow =
        window.open(
          "",
          "",
          "width=900,height=1000"
        );

      if (!printWindow) {

        alert("Popup blocked");

        return;

      }

      printWindow.document.write(`

<html>

<head>

  <title>
    Water Service Application
  </title>

  <style>

    @page{
      size:A4;
      margin:18mm;
    }

    body{
      font-family:Arial;
      line-height:1.6;
      color:#111827;
      font-size:13px;
      padding:20px;
    }

    .header{
      text-align:center;
      margin-bottom:25px;
    }

    .header h1{
      margin:0;
      font-size:24px;
    }

    .header h2{
      margin:0;
      font-size:18px;
    }

    .section{
      margin-top:25px;
    }

    .line{
      border-bottom:1px solid black;
      display:inline-block;
      min-width:260px;
      padding:2px 5px;
    }

    .info-row{
      margin-bottom:12px;
    }

    ol li{
      margin-bottom:12px;
      text-align:justify;
    }

    .signature-section{
      margin-top:60px;
      display:flex;
      justify-content:space-between;
      text-align:center;
      gap:20px;
    }

    .signature{
      flex:1;
    }

    .signature-line{
      border-top:1px solid black;
      margin-top:50px;
      padding-top:5px;
      font-weight:bold;
    }

    .approved{
      margin-top:50px;
      text-align:center;
    }

    table{
      width:100%;
      margin-top:40px;
      border-collapse:collapse;
    }

    td{
      padding:10px;
      border:1px solid #000;
    }

    .installation-title{
      margin-top:40px;
      font-weight:bold;
      font-size:16px;
    }

  </style>

</head>

<body>

  <div class="header">

    <p>
      Republic of the Philippines
    </p>

    <p>
      Province of Negros Oriental
    </p>

    <h1>
      MUNICIPALITY OF MANJUYOD
    </h1>

    <h2>
      MANJUYOD WATERWORKS DEPARTMENT
    </h2>

    <br />

    <h2>
      MEMORANDUM OF AGREEMENT
    </h2>

  </div>

  <div class="section">

    <div class="info-row">
      <strong>Full Name:</strong>
      <span class="line">
        ${escapeHtml(user.fullName)}
      </span>
    </div>

    <div class="info-row">
      <strong>Email:</strong>
      <span class="line">
        ${escapeHtml(user.email)}
      </span>
    </div>

    <div class="info-row">
      <strong>Contact Number:</strong>
      <span class="line">
        ${escapeHtml(user.contactNumber)}
      </span>
    </div>

    <div class="info-row">
      <strong>Address:</strong>
      <span class="line">
        ${escapeHtml(user.address)}
      </span>
    </div>

    <div class="info-row">
      <strong>Landmark:</strong>
      <span class="line">
        ${escapeHtml(user.landmark || "N/A")}
      </span>
    </div>

  </div>

  <div class="section">

    <p>
      Application is hereby made for water services to be supplied by the Manjuyod Waterworks Department to the water Consumer in accordance with the existing local and national laws and it’s IRR, now in force or maybe in force thereafter.
    </p>

    <br />

    <p>
      In addition, I hereby agree:
    </p>

    <ol>

      <li>
        To abide all the rules and regulations as water Consumer provided in the Municipal Ordinance No. 019, and of the Water Code of the Philippines.
      </li>

      <li>
        To pay my monthly bill to the Municipal Treasurer’s Office for the water services furnished within ten (10) days from receipt thereof.
      </li>

      <li>
        To notify in writing the Municipal Waterworks Department and the Municipal Treasurer’s Office when the Consumer transfer the ownership of the property.
      </li>

      <li>
        To notify in writing the Municipal Waterworks Department and the Municipal Treasurer’s Office when the Consumer wants to discontinue the services of water for proper settlement of account and disconnection.
      </li>

      <li>
        Representative/s of Manjuyod Waterworks Department hereby given free access to enable them to perform their official duties.
      </li>

      <li>
        That I will be responsible for the functionality and readability of my water meter.
      </li>

      <li>
        That I will not allow flying connection at all times.
      </li>

      <li>
        That I will not allow the use of electric driven pump directly from main pipeline.
      </li>

      <li>
        That the Manjuyod Waterworks Department shall be permitted for the interruption of the service due to causes beyond control.
      </li>

    </ol>

  </div>

  <div class="signature-section">

    <div class="signature">

      <div class="signature-line">
        ${escapeHtml(user.fullName)}
      </div>

      Applicant / Consumer

    </div>

    <div class="signature">

      <div class="signature-line">
        ERWIN D. QUE
      </div>

      OIC – Waterworks Department

    </div>

    <div class="signature">

      <div class="signature-line">
        DANILO F. CADALSO
      </div>

      MPDC

    </div>

  </div>

  <div class="approved">

    <p>
      Approved:
    </p>

    <br /><br />

    <div
      style="
        width:300px;
        margin:auto;
        border-top:1px solid black;
        padding-top:5px;
        font-weight:bold;
      "
    >
      RAFFY ALIPIO S. ANDAYA J.D.
    </div>

    Municipal Mayor

  </div>

  <div class="installation-title">
    Installation Details
  </div>

  <table>

    <tr>

      <td>
        Installation Fee
      </td>

      <td>
        ₱ ${escapeHtml(installationFee)}
      </td>

      <td>
        O.R Number
      </td>

      <td>
        ${escapeHtml(orNumber)}
      </td>

    </tr>

    <tr>

      <td>
        Water Meter Make
      </td>

      <td colspan="3">
        ${escapeHtml(waterMeterMake)}
      </td>

    </tr>

    <tr>

      <td>
        Serial Number
      </td>

      <td colspan="3">
        ${escapeHtml(serialNo)}
      </td>

    </tr>

    <tr>

      <td>
        Initial Reading
      </td>

      <td colspan="3">
        ${escapeHtml(initialReading)}
      </td>

    </tr>

    <tr>

      <td>
        Installed By
      </td>

      <td colspan="3">
        ${escapeHtml(installedBy)}
      </td>

    </tr>

    <tr>

      <td>
        Remarks
      </td>

      <td colspan="3">
        ${escapeHtml(remarks)}
      </td>

    </tr>

  </table>

</body>

</html>

      `);

      printWindow.document.close();

      printWindow.focus();

      setTimeout(() => {

        printWindow.print();

      }, 500);

    };

  const filteredUsers =
    useMemo(() => {

      return users.filter((user) => {

        const matchesSearch =

          user.fullName
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )

          ||

          user.email
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesStatus =

          statusFilter === "All"

          ||

          user.applicationStatus === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );

      });

    }, [
      users,
      search,
      statusFilter,
    ]);

  return (

    <div className="dashboard-layout">

      <aside className="sidebar">

        <div className="sidebar-header">

          <img
            src={logo}
            alt="logo"
            className="sidebar-logo"
          />

          <div>

            <h1>
              MANJUYOD
            </h1>

            <p>
              WATERWORKS SYSTEM
            </p>

          </div>

        </div>

        <nav className="sidebar-nav">

          <button
            className="nav-item active"
            onClick={() =>
              navigate("/admin-dashboard")
            }
          >

            <FileText size={18} />

            <span>
              Application Management
            </span>

          </button>
          {showNotifications && (

  <div className="notification-dropdown">

    <h4>
      Notifications
    </h4>

    {notifications.length === 0 ? (

      <p>
        No notifications
      </p>

    ) : (

      notifications.map((item) => (

        <div
          key={item._id}
          className="notification-item"
        >

          <p>
            {item.message}
          </p>

          <small>

            {new Date(
              item.createdAt
            ).toLocaleString()}

          </small>

        </div>

      ))

    )}

  </div>

)}

          <button
            className="nav-item"
            onClick={() =>
              navigate("/consumer-records")
            }
          >

            <Users size={18} />

            <span>
              Consumer Records
            </span>

          </button>

          <button
            className="nav-item"
            onClick={() =>
              navigate("/billing")
            }
          >

            <Receipt size={18} />

            <span>
              Billing
            </span>

          </button>

        </nav>

        <button
          className="logout-btn"
          onClick={() =>
            navigate("/")
          }
        >

          <LogOut size={18} />

          Logout

        </button>

      </aside>

      <main className="main-content">

        <header className="topbar">

          <div>

            <p className="topbar-label">
              ADMIN PORTAL
            </p>

            <h2>
              Application Management
            </h2>

          </div>

          <div
  className="notification-wrapper"
  ref={notificationRef}
>

            <button
  className="notification-btn"
  onClick={() =>
    setShowNotifications(
      !showNotifications
    )
  }
>

              <Bell size={20} />

              {notifications.length > 0 && (

                <span className="notification-badge">
                  {notifications.length}
                </span>

              )}

            </button>

          </div>

        </header>

        <section className="table-section">

          <div className="table-toolbar">

            <h2>
              Recent Applications
            </h2>

          </div>

          <div className="filters-row">

            <div className="search-box">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search applicants..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >

              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Rejected">
                Rejected
              </option>

            </select>

          </div>

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>CONTACT</th>
                  <th>ADDRESS</th>
                  <th>LANDMARK</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td colSpan="7">
                      Loading...
                    </td>

                  </tr>

                ) : (

                  filteredUsers.map(
                    (user) => (

                      <tr key={user._id}>

                        <td>
                          {user.fullName}
                        </td>

                        <td>
                          {user.email}
                        </td>

                        <td>
                          {user.contactNumber}
                        </td>

                        <td>
                          {user.address}
                        </td>

                        <td>
                          {user.landmark || "N/A"}
                        </td>

                        <td>

                          <span
                            className={`status-badge ${user.applicationStatus?.toLowerCase()}`}
                          >
                            {user.applicationStatus}
                          </span>

                        </td>

                        <td>

                          <div className="action-buttons">

                            <button
                              className="icon-action"
                              onClick={() =>
                                printApplication(user)
                              }
                              style={{
                                background:"#0f172a",
                                color:"white",
                              }}
                              title="Print Application"
                            >

                              🖨

                            </button>

                            <button
  className="icon-action"
  onClick={() => {

    if (!user.validId) {

      alert("No Valid ID uploaded");

      return;

    }

    window.open(
      `http://localhost:5000/uploads/${user.validId}`,
      "_blank"
    );

  }}
  style={{
    background:"#2563eb",
    color:"white",
  }}
  title="View Valid ID"
>

  👁

</button>

                            <button
                              className="icon-action success"
                              onClick={() =>
                                updateStatus(
                                  user._id,
                                  "Approved"
                                )
                              }
                              title="Approve"
                            >

                              <CheckCircle2 size={18} />

                            </button>

                            <button
                              className="icon-action warning"
                              onClick={() =>
                                updateStatus(
                                  user._id,
                                  "Rejected"
                                )
                              }
                              title="Reject"
                            >

                              <XCircle size={18} />

                            </button>

                            <button
                              className="icon-action danger"
                              onClick={() =>
                                deleteUser(user._id)
                              }
                              title="Delete"
                            >

                              🗑

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>

  );

}

export default AdminDashboard;
