import "./AdminDashboard.css";

import logo from "../assets/logo.png";

import {
  Receipt,
  FileText,
  Users,
  Bell,
  Search,
  LogOut,
} from "lucide-react";

import {
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

function Billing() {

  const navigate =
    useNavigate();

    const admin =
  JSON.parse(localStorage.getItem("admin"));

const role = admin?.role || "admin";

const canCreateBill =
  role === "meterReader";

const canMarkPaid =
  role === "cashier";

const canViewOnly =
  role === "admin";

  const getNextReadingDate = (latestReadingDate) => {

  if (!latestReadingDate) {
    return "";
  }

  const date =
    new Date(latestReadingDate);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  date.setMonth(
    date.getMonth() + 1
  );

  return date
    .toISOString()
    .split("T")[0];

};
const getDueDate = (readingDate) => {

  if (!readingDate) {
    return "";
  }

  const date =
    new Date(readingDate);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  date.setDate(
    date.getDate() + 10
  );

  return date
    .toISOString()
    .split("T")[0];

};
  const [users, setUsers] =
    useState([]);

  const [bills, setBills] =
    useState([]);

  const [search, setSearch] =
    useState("");

    const [
  consumerSearch,
  setConsumerSearch,
] = useState("");

const [
  showSuggestions,
  setShowSuggestions,
] = useState(false);

  const [notifications, setNotifications] =
    useState([]);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const notificationRef =
    useRef(null);

  const [formData, setFormData] =
    useState({

      userId: "",
      accountNumber: "",
      previousReading: "",
      currentReading: "",
      readingDate: "",
      dueDate: "",
      meterReaderName: "",

    });

  useEffect(() => {

    fetchUsers();

    fetchBills();

    fetchNotifications();

  }, []);
useEffect(() => {

  if (!admin) {
    navigate("/");
    return;
  }

 if (
  role !== "admin" &&
  role !== "cashier" &&
  role !== "meterReader"
) {
  navigate("/");
}

}, [admin, role, navigate]);
  const fetchUsers =
  async () => {

    try {

      const res =
        await axios.get(
          "https://manjuyod-water-production.up.railway.app/api/admin/approved-users"
        );

      setUsers(
        res.data
      );

    }

    catch (error) {

      console.log(error);

    }

  };
  const fetchBills =
    async () => {

      try {

        const res =
          await axios.get(
            "https://manjuyod-water-production.up.railway.app/api/admin/billing"
          );

        setBills(
          res.data
        );

      }

      catch (error) {

        console.log(error);

      }

    };

  const fetchNotifications =
    async () => {

      try {

        const res =
          await axios.get(
            "https://manjuyod-water-production.up.railway.app/api/admin/notifications"
          );

        setNotifications(
          res.data
        );

      }

      catch (error) {

        console.log(error);

      }

    };

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

  const handleChange =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value,

      });

    };

  const handleCreateBill =
    async (e) => {

      e.preventDefault();

      try {

        await axios.post(
  "https://manjuyod-water-production.up.railway.app/api/admin/billing/create",
  {
    ...formData,
    meterReaderName: admin?.name || "Meter Reader",
  }
);

        alert(
          "Bill created successfully"
        );

        fetchBills();

        setFormData({

          userId: "",
          accountNumber: "",
          previousReading: "",
          currentReading: "",
          readingDate: "",
          dueDate: "",
          meterReaderName: "",

        });

      }

      catch (error) {

        console.log(error);

      }

    };

  const markAsPaid =
    async (billId) => {

      try {

        await axios.put(
          `https://manjuyod-water-production.up.railway.app/api/admin/billing/status/${billId}`,
          {
            status: "Paid",
          }
        );

        fetchBills();

      }

      catch (error) {

        console.log(error);

      }

    };

  const filteredBills =
    useMemo(() => {

      return bills.filter(
        (bill) => {

          return (

            bill.userId?.fullName
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )

            ||

            bill.accountNumber
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )

          );

        }
      );

    }, [

      bills,
      search,

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

  {role === "admin" && (

    <>
      <button
        className="nav-item"
        onClick={() =>
          navigate("/admin-dashboard")
        }
      >
        <FileText size={18} />

        <span>
          Application Management
        </span>
      </button>

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
    </>

  )}

  <button
    className="nav-item active"
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
  {role === "cashier"
    ? "CASHIER PORTAL"
    : role === "meterReader"
    ? "METER READER PORTAL"
    : "ADMIN PORTAL - VIEW ONLY"}
</p>

            <h2>
              Billing Management
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

              <Bell size={22} />

              {notifications.length > 0 && (

                <span className="notification-badge">

                  {notifications.length}

                </span>

              )}

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

          </div>

        </header>

        <section className="table-section">
{canCreateBill && (
          <form
            onSubmit={
              handleCreateBill
            }
            className="billing-form"
          >

            <div className="form-field consumer-search-wrapper">

  <label>
    Consumer Name
  </label>

  <input
    type="text"
    placeholder="Search consumer name or account number..."
    value={consumerSearch}

    onChange={(e) => {

      setConsumerSearch(
        e.target.value
      );

      setShowSuggestions(true);

    }}

    className="billing-input"
    required
  />

  {

    showSuggestions

    &&

    consumerSearch

    &&

    <div className="consumer-suggestions">

      {

        users

        .filter((user) =>

          user.fullName
            ?.toLowerCase()
            .includes(
              consumerSearch.toLowerCase()
            )

          ||

          user.accountNumber
            ?.toLowerCase()
            .includes(
              consumerSearch.toLowerCase()
            )

        )

        .map((user) => (

          <div

            key={user._id}

            className="consumer-suggestion-item"

           onClick={async () => {

  try {

    const res =
      await axios.get(
        `https://manjuyod-water-production.up.railway.app/api/admin/billing/user/${user._id}`
      );

    const latestBill =
      res.data && res.data.length > 0
        ? res.data[0]
        : null;

    setFormData({

      ...formData,

      userId:
        user._id,

      accountNumber:
        user.accountNumber,

      previousReading:
        latestBill
          ? latestBill.currentReading
          : "",

         readingDate:
  latestBill
    ? getNextReadingDate(latestBill.readingDate)
    : "",

dueDate:
  latestBill
    ? getDueDate(
        getNextReadingDate(latestBill.readingDate)
      )
    : "",

      meterReaderName:
        admin?.name || "Meter Reader",

    });

    setConsumerSearch(
      `${user.fullName}`
    );

    setShowSuggestions(false);

  } catch (error) {

    console.log(error);

    setFormData({

      ...formData,

      userId:
        user._id,

      accountNumber:
        user.accountNumber,

      previousReading: "",

      meterReaderName:
        admin?.name || "Meter Reader",

    });

    setConsumerSearch(
      `${user.fullName}`
    );

    setShowSuggestions(false);

  }

}}

          >

            <strong>
              {user.fullName}
            </strong>

            <span>
              {user.accountNumber}
            </span>

          </div>

        ))

      }

    </div>

  }

</div>

           <div className="form-field">
  <label>Account Number</label>

  <input
    type="text"
    name="accountNumber"
    value={formData.accountNumber}
    onChange={handleChange}
    required
  />
</div>

<div className="form-field">
  <label>Previous Reading (m³)</label>

  <input
  type="number"
  name="previousReading"
  value={formData.previousReading}
  onChange={handleChange}
  readOnly
  required
/>

<small className="input-note">
  Auto-filled from the consumer's latest reading.
</small>
</div>

<div className="form-field">
  <label>Current Reading (m³)</label>

  <input
    type="number"
    name="currentReading"
    value={formData.currentReading}
    onChange={handleChange}
    required
  />
</div>

            <div className="form-field">
  <label htmlFor="readingDate">
    Reading Date
  </label>

  <input
    type="date"
    id="readingDate"
    name="readingDate"
    value={formData.readingDate}
    onChange={handleChange}
    required
  />
</div>

<div className="form-field">
  <label htmlFor="dueDate">
    Due Date
  </label>

  <input
    type="date"
    id="dueDate"
    name="dueDate"
    value={formData.dueDate}
    onChange={handleChange}
    required
  />
</div>

            <input
  type="text"
  name="meterReaderName"
  placeholder="Meter Reader Name"
  value={admin?.name || "Meter Reader"}
  readOnly
  required
/>

            <button
              type="submit"
              className="primary-btn"
            >

              Create Bill

            </button>

          </form>
          )}

         <div className="billing-guide">
  <h4>Billing Rate Guide</h4>

  <p>
    <strong>1–5 cubic meters (m³):</strong> ₱5 per cubic meter
  </p>

  <p>
    <strong>6 cubic meters and above:</strong> ₱10 per cubic meter
  </p>

  <hr style={{ margin: "10px 0", opacity: 0.2 }} />

  <p>
    <strong>Formula:</strong>
  </p>

  <p>
    • If consumption is <strong>1–5 m³</strong>:<br />
    <code>(Current Reading − Previous Reading) × ₱5</code>
  </p>

  <p>
    • If consumption is <strong>6 m³ and above</strong>:<br />
    <code>(Current Reading − Previous Reading) × ₱10</code>
  </p>
</div>

        </section>

        <section className="table-section">

          <div className="table-toolbar">

            <h2>
              Billing Records
            </h2>

            <div className="search-box">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search resident or account number..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>Consumer</th>
                  <th>Account #</th>
                  <th>Consumption</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Meter Reader</th>
                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {filteredBills.map(
                  (bill) => (

                    <tr
                      key={bill._id}
                    >

                      <td>

                        {
                          bill.userId
                            ?.fullName
                        }

                      </td>

                      <td>
                        {
                          bill.accountNumber
                        }
                      </td>

                      <td>

                        {
                          bill.consumption
                        } m³

                      </td>

                      <td>{Number(bill.amount).toLocaleString("en-PH", {
  style: "currency",
  currency: "PHP"
})}</td>

                      <td>
                        {
                          bill.status
                        }
                      </td>

                      <td>

                        {
                          bill.meterReaderName
                        }

                      </td>

                      <td>

                        {bill.status === "Unpaid" ? (

  role === "cashier" ? (

    <button
      className="primary-btn"
      onClick={() =>
        markAsPaid(bill._id)
      }
    >
      Mark Paid
    </button>

  ) : (

    <span className="view-only-label">
      View Only
    </span>

  )

) : (

  <span>
    Paid on {bill.paidDate}
  </span>

)}

                      </td>

                    </tr>

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

export default Billing;
