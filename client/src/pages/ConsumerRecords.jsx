import "./AdminDashboard.css";

import logo from "../assets/logo.png";

import {
  Users,
  FileText,
  Receipt,
  Bell,
  Search,
  LogOut,
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

function ConsumerRecords() {

  const navigate =
    useNavigate();

  const [users, setUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [
    selectedAddress,
    setSelectedAddress,
  ] = useState("All");

  const [notifications, setNotifications] =
    useState([]);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const notificationRef =
    useRef(null);

  useEffect(() => {

    fetchUsers();

    fetchNotifications();

  }, []);

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

  const uniqueAddresses = [

    ...new Set(

      users.map(
        (user) =>
          user.address
      )

    ),

  ];

  const filteredUsers =
    useMemo(() => {

      return users.filter(
        (user) => {

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
              )

            ||

            user.accountNumber
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesAddress =

            selectedAddress ===
              "All"

            ||

            user.address ===
              selectedAddress;

          return (

            matchesSearch

            &&

            matchesAddress

          );

        }
      );

    }, [

      users,

      search,

      selectedAddress,

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
            className="nav-item"
            onClick={() =>
              navigate(
                "/admin-dashboard"
              )
            }
          >

            <FileText size={18} />

            <span>
              Application Management
            </span>

          </button>

          <button
            className="nav-item active"
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
              Consumer Records
            </h2>

          </div>

          <div className="topbar-right">

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

          </div>

        </header>

        <section className="table-section">

          <div className="table-toolbar">

            <h2>
              Approved Consumers
            </h2>

          </div>

          <div className="filters-row">

            <div className="search-box">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search consumers..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            <select
              value={
                selectedAddress
              }

              onChange={(e) =>
                setSelectedAddress(
                  e.target.value
                )
              }

              className="filter-select"
            >

              <option value="All">

                All Addresses

              </option>

              {
                uniqueAddresses.map(
                  (address) => (

                    <option
                      key={address}
                      value={address}
                    >
                      {address}
                    </option>

                  )
                )
              }

            </select>

          </div>

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Address</th>

                </tr>

              </thead>

              <tbody>

                {
                  filteredUsers.length === 0 ? (

                    <tr>

                      <td
                        colSpan="4"
                        style={{
                          textAlign:"center",
                          padding:"20px",
                        }}
                      >

                        No approved consumers found

                      </td>

                    </tr>

                  ) : (

                    filteredUsers.map(
                      (user) => (

                        <tr
                          key={user._id}
                        >

                          <td>
                            {
                              user.fullName
                            }
                          </td>

                          <td>
                            {
                              user.email
                            }
                          </td>

                          <td>
                            {
                              user.contactNumber
                            }
                          </td>

                          <td>
                            {
                              user.address
                            }
                          </td>

                        </tr>

                      )
                    )

                  )
                }

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>

  );

}

export default ConsumerRecords;
