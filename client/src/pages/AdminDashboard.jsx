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

import { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const API_URL = "https://manjuyod-water-production.up.railway.app";

  const emptyContractData = {
    applicationNo: "",
    purpose: "",
    size: "",
    installationFee: "",
    orNumber: "",
    orDate: "",
    waterMeterMake: "",
    serialNo: "",
    dateTested: "",
    initialReading: "",
    dateInstalled: "",
    installedBy: "",
    remarks: "",
  };

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const [showPrintForm, setShowPrintForm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [contractData, setContractData] = useState(emptyContractData);

  useEffect(() => {
    fetchUsers();
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/users`);
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/notifications`);
      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/api/admin/status/${id}`, { status });
      fetchUsers();
      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
  "Are you sure? This will remove the application and block the resident from logging in."
);
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/admin/user/${id}`);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const openPrintForm = (application) => {
    setSelectedApplication(application);

    setContractData({
      ...emptyContractData,
      purpose: application.connectionType || "",
    });

    setShowPrintForm(true);
  };

  const handleContractChange = (e) => {
    const { name, value } = e.target;

    setContractData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateContractForm = () => {
  const requiredFields = [
    { key: "applicationNo", label: "Application No." },
    { key: "purpose", label: "Purpose of Connection" },
    { key: "size", label: "Size" },
    { key: "installationFee", label: "Installation Fee" },
    { key: "orNumber", label: "O.R. No." },
    { key: "orDate", label: "O.R. Date" },
    { key: "waterMeterMake", label: "Water Meter Make" },
    { key: "serialNo", label: "Serial No." },
    { key: "dateTested", label: "Date Tested" },
    { key: "initialReading", label: "Initial Reading" },
    { key: "dateInstalled", label: "Date Installed" },
    { key: "installedBy", label: "Installed By" },
  ];

  const missingFields = requiredFields.filter(
    (field) => !String(contractData[field.key] || "").trim()
  );

  if (missingFields.length > 0) {
    alert(
      "Please fill in the required fields:\n\n" +
        missingFields.map((field) => `• ${field.label}`).join("\n")
    );

    return false;
  }

  return true;
};

  const printApplication = (application, data) => {
    if (!application) {
      alert("No selected application.");
      return;
    }

    const printWindow = window.open("", "", "width=900,height=1000");

    if (!printWindow) {
      alert("Popup blocked. Please allow popups.");
      return;
    }

    printWindow.document.write(`
<html>
<head>
  <title>Application and Contract of Water Services</title>

  <style>
    @page {
      size: A4;
      margin: 14mm;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #000;
      font-size: 12px;
      line-height: 1.45;
      margin: 0;
      padding: 0;
    }

    .page {
      width: 100%;
    }

    .header {
      text-align: center;
      margin-bottom: 12px;
    }

    .header p {
      margin: 2px 0;
    }

    .office {
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 6px;
    }

    .title {
      text-align: center;
      font-weight: bold;
      font-size: 16px;
      margin: 18px 0;
      text-transform: uppercase;
    }

    .row {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
      align-items: flex-end;
    }

    .label {
      font-weight: bold;
      white-space: nowrap;
    }

    .line {
      border-bottom: 1px solid #000;
      flex: 1;
      min-height: 18px;
      padding: 0 4px;
    }

    .short-line {
      border-bottom: 1px solid #000;
      width: 150px;
      min-height: 18px;
      padding: 0 4px;
    }

    .moa-title {
      text-align: center;
      font-weight: bold;
      font-size: 15px;
      margin: 18px 0 10px;
      text-transform: uppercase;
    }

    p {
      text-align: justify;
      margin: 8px 0;
    }

    ol {
      margin: 8px 0 0 20px;
      padding: 0;
    }

    li {
      margin-bottom: 7px;
      text-align: justify;
    }

    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 45px;
      text-align: center;
    }

    .signature-line {
      border-top: 1px solid #000;
      padding-top: 4px;
      font-weight: bold;
      min-height: 20px;
    }

    .checked-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 35px;
      text-align: center;
    }

    .approved {
      width: 320px;
      margin: 35px auto 20px;
      text-align: center;
    }

    .install-section {
      margin-top: 20px;
      border-top: 1px solid #000;
      padding-top: 12px;
    }

    .install-row {
      display: grid;
      grid-template-columns: 120px 1fr 80px 1fr 60px 1fr;
      gap: 6px;
      align-items: end;
      margin-bottom: 8px;
    }

    .install-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 8px;
      margin-top: 10px;
    }

    .install-label {
      font-weight: bold;
    }

    .install-value {
      border-bottom: 1px solid #000;
      min-height: 18px;
      padding: 0 4px;
    }
  </style>
</head>

<body>
  <div class="page">
    <div class="header">
      <p>Republic of the Philippines</p>
      <p>Province of Negros Oriental</p>
      <p class="office">Office of the Municipal Mayor</p>
      <p>Manjuyod, Negros Oriental</p>
      <p>-o0o-</p>
    </div>

    <div class="title">
      Application and Contract of Water Services
    </div>

    <div class="row">
      <span class="label">Name of Applicant:</span>
      <span class="line">${escapeHtml(application.fullName)}</span>
      <span class="label">Application No.:</span>
      <span class="short-line">${escapeHtml(data.applicationNo)}</span>
    </div>

    <div class="row">
      <span class="label">Address:</span>
      <span class="line">${escapeHtml(application.address)}</span>
    </div>

    <div class="row">
      <span class="label">Location of Service:</span>
      <span class="line">${escapeHtml(application.landmark || application.address || "")}</span>
    </div>

    <div class="row">
      <span class="label">Purpose of Connection:</span>
      <span class="line">${escapeHtml(data.purpose || application.connectionType || "")}</span>
      <span class="label">Size:</span>
      <span class="short-line">${escapeHtml(data.size)}</span>
    </div>

    <div class="moa-title">
      Memorandum of Agreement
    </div>

    <p>
      Application is hereby made for water services to be supplied by the Manjuyod Waterworks Department to the water Consumer in accordance with the existing local and national laws and its IRR, now in force or may be in force thereafter.
    </p>

    <p>In addition, I hereby agree:</p>

    <ol>
      <li>To abide all the rules and regulations as water Consumer provided in the Municipal Ordinance No. 019, and of the Water Code of the Philippines.</li>
      <li>To pay my monthly bill to the Municipal Treasurer’s Office for the water services furnished within ten (10) days from receipt thereof;</li>
      <li>To notify in writing the Municipal Waterworks Department and the Municipal Treasurer’s Office when the Consumer transfers the ownership of the property;</li>
      <li>To notify in writing the Municipal Waterworks Department and the Municipal Treasurer’s Office when the Consumer wants to discontinue the services of water for proper settlement of account and disconnection;</li>
      <li>Representative/s of Manjuyod Waterworks Department are hereby given free access to enable them to perform their official duties;</li>
      <li>That I will be responsible for the functionality and readability of my water meter. Failure to do so, the Manjuyod Waterworks Department is authorized to discontinue the services of water;</li>
      <li>That I will not allow flying connection at all times;</li>
      <li>That I will not allow the use of electric driven pump directly from main pipeline;</li>
      <li>That the house/building owner guarantees and assumes responsibility of all water and/or other accounts incurred in connection with said water service upon default of obligation by the above-mentioned applicant;</li>
      <li>That the Manjuyod Waterworks Department shall be permitted for the interruption of the service due to causes beyond control and may disconnect the services upon violation of the terms of the contract, or when the Manjuyod Waterworks Department has reasonable grounds to believe that the Consumer is using water in violation of the existing rules and regulations;</li>
      <li>That this AGREEMENT shall not be binding unless it is signed by the applicant, the property-owner and approved by the Municipal Mayor or by his duly authorized representative.</li>
    </ol>

    <div class="signatures">
      <div>
        <div class="signature-line">${escapeHtml(application.fullName)}</div>
        <div>(Name & Signature of Applicant)</div>
      </div>

      <div>
        <div class="signature-line">&nbsp;</div>
        <div>(Name & Signature of Building Owner)</div>
      </div>
    </div>

    <div class="checked-section">
      <div>
        <p style="text-align:left;">Checked by:</p>
        <br />
        <div class="signature-line">ERWIN D. QUE</div>
        <div>OIC – Waterworks Department</div>
      </div>

      <div>
        <p style="text-align:left;">Recommending Approval:</p>
        <br />
        <div class="signature-line">DANILO F. CADALSO</div>
        <div>MPDC</div>
      </div>
    </div>

    <div class="approved">
      <p style="text-align:center;">Approved:</p>
      <br />
      <div class="signature-line">RAFFY ALIPIO S. ANDAYA J.D.</div>
      <div>Municipal Mayor</div>
      <div style="margin-top:10px;">Date: ${escapeHtml(data.orDate)}</div>
    </div>

    <div class="install-section">
      <div class="install-row">
        <div class="install-label">Installation Fee</div>
        <div class="install-value">₱ ${escapeHtml(data.installationFee)}</div>
        <div class="install-label">O.R. No.</div>
        <div class="install-value">${escapeHtml(data.orNumber)}</div>
        <div class="install-label">Date</div>
        <div class="install-value">${escapeHtml(data.orDate)}</div>
      </div>

      <div class="install-grid">
        <div class="install-label">Water Meter Make</div>
        <div class="install-value">${escapeHtml(data.waterMeterMake)}</div>

        <div class="install-label">Serial No.</div>
        <div class="install-value">${escapeHtml(data.serialNo)}</div>

        <div class="install-label">Date Tested</div>
        <div class="install-value">${escapeHtml(data.dateTested)}</div>

        <div class="install-label">Initial Reading</div>
        <div class="install-value">${escapeHtml(data.initialReading)}</div>

        <div class="install-label">Date Installed</div>
        <div class="install-value">${escapeHtml(data.dateInstalled)}</div>

        <div class="install-label">Installed by</div>
        <div class="install-value">${escapeHtml(data.installedBy)}</div>

        <div class="install-label">Remarks</div>
        <div class="install-value">${escapeHtml(data.remarks)}</div>
      </div>
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

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || user.applicationStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="logo" className="sidebar-logo" />

          <div>
            <h1>MANJUYOD</h1>
            <p>WATERWORKS SYSTEM</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className="nav-item active"
            onClick={() => navigate("/admin-dashboard")}
          >
            <FileText size={18} />
            <span>Application Management</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/consumer-records")}
          >
            <Users size={18} />
            <span>Consumer Records</span>
          </button>

          <button className="nav-item" onClick={() => navigate("/billing")}>
            <Receipt size={18} />
            <span>Billing</span>
          </button>
        </nav>

        <button className="logout-btn" onClick={() => navigate("/")}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="topbar-label">ADMIN PORTAL</p>
            <h2>Application Management</h2>
          </div>

          <div className="notification-wrapper" ref={notificationRef}>
            <button
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />

              {notifications.length > 0 && (
                <span className="notification-badge">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <h4>Notifications</h4>

                {notifications.length === 0 ? (
                  <p>No notifications</p>
                ) : (
                  notifications.map((item) => (
                    <div key={item._id} className="notification-item">
                      <p>{item.message}</p>
                      <small>
  {new Date(item.createdAt).toLocaleString(
    "en-PH",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Manila",
    }
  )} (GMT+8)
</small>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </header>

        <section className="table-section">
          <div className="table-toolbar">
            <h2>Recent Applications</h2>
          </div>

          <div className="filters-row">
            <div className="search-box">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search applicants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
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
                  <th>NEAREST LANDMARK</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7">Loading...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7">No applications found</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.contactNumber}</td>
                      <td>{user.address}</td>
                      <td>{user.landmark || "N/A"}</td>

                      <td>
                        <span
                          className={`status-badge ${user.applicationStatus?.toLowerCase()}`}
                        >
                          {user.applicationStatus}
                        </span>
                      </td>

                      <td>
  <div className="action-buttons">

  {user.applicationStatus === "Approved" && (
  <button
    className="icon-action print"
    onClick={() => openPrintForm(user)}
    title="Print Application"
  >
    🖨️
  </button>
)}

  <button
    className="icon-action view"
    onClick={() => {
      if (!user.validId) {
        alert("No Valid ID uploaded");
        return;
      }

      window.open(
        `${API_URL}/uploads/${user.validId}`,
        "_blank"
      );
    }}
    title="View Valid ID"
  >
    👁️
  </button>

  {user.applicationStatus === "Pending" && (
  <button
    className="icon-action success"
    onClick={() => updateStatus(user._id, "Approved")}
  >
    <CheckCircle2 size={24} />
  </button>
)}

 {user.applicationStatus === "Pending" && (
  <button
    className="icon-action warning"
    onClick={() => updateStatus(user._id, "Rejected")}
  >
    <XCircle size={24} />
  </button>
)}

  <button
    className="icon-action danger"
    onClick={() => deleteUser(user._id)}
    title="Delete"
  >
    🗑️
  </button>

</div>
</td>
</tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {showPrintForm && (
        <div className="print-overlay">
          <div className="print-form">
            <h2>Application and Contract of Water Services</h2>

            <p className="print-form-subtitle">
              Fill out the installation and contract details before printing.
            </p>

            <div className="print-form-grid">
              <div>
                <label>Application No.</label>
                <input
                required
                  name="applicationNo"
                  value={contractData.applicationNo}
                  onChange={handleContractChange}
                  placeholder="Application No."
                />
              </div>

              <div>
                <label>Purpose of Connection</label>
                <input
                required
                  name="purpose"
                  value={contractData.purpose}
                  onChange={handleContractChange}
                  placeholder="Residential / Commercial"
                />
              </div>

              <div>
                <label>Size</label>
                <input
                required
                  name="size"
                  value={contractData.size}
                  onChange={handleContractChange}
                  placeholder="Connection size"
                />
              </div>

              <div>
                <label>Installation Fee</label>
                <input
                required
                  name="installationFee"
                  value={contractData.installationFee}
                  onChange={handleContractChange}
                  placeholder="Amount"
                />
              </div>

              <div>
                <label>O.R. No.</label>
                <input
                required
                  name="orNumber"
                  value={contractData.orNumber}
                  onChange={handleContractChange}
                  placeholder="Official Receipt No."
                />
              </div>

              <div>
                <label>O.R. Date</label>
                <input
                required
                  type="date"
                  name="orDate"
                  value={contractData.orDate}
                  onChange={handleContractChange}
                />
              </div>

              <div>
                <label>Serial No.</label>
                <input
                required
                  name="serialNo"
                  value={contractData.serialNo}
                  onChange={handleContractChange}
                  placeholder="Serial number"
                />
              </div>

              <div>
                <label>Date Tested</label>
                <input
                required
                  type="date"
                  name="dateTested"
                  value={contractData.dateTested}
                  onChange={handleContractChange}
                />
              </div>

              <div>
                <label>Initial Reading</label>
                <input
                required
                  name="initialReading"
                  value={contractData.initialReading}
                  onChange={handleContractChange}
                  placeholder="Initial reading"
                />
              </div>

              <div>
                <label>Date Installed</label>
                <input
                required
                  type="date"
                  name="dateInstalled"
                  value={contractData.dateInstalled}
                  onChange={handleContractChange}
                />
              </div>

              <div>
                <label>Installed By</label>
                <input
                required
                  name="installedBy"
                  value={contractData.installedBy}
                  onChange={handleContractChange}
                  placeholder="Installer name"
                />
              </div>
            </div>

            <label>Remarks</label>
            <textarea
              name="remarks"
              value={contractData.remarks}
              onChange={handleContractChange}
              placeholder="Remarks"
            />

            <div className="print-form-actions">
              <button
                type="button"
                className="cancel-print-btn"
                onClick={() => setShowPrintForm(false)}
              >
                Cancel
              </button>

             <button
  type="button"
  className="generate-print-btn"
  onClick={() => {
    if (!validateContractForm()) return;

    printApplication(selectedApplication, contractData);
    setShowPrintForm(false);
  }}
>
  Generate Document
</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
