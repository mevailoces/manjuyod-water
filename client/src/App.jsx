import "./App.css";

import logo from "./assets/logo.png";

import {
useNavigate,
} from "react-router-dom";

import Applications from "./pages/Applications";
import ConsumerRecords from "./pages/ConsumerRecords";

export default function App() {

const navigate =
useNavigate();

return (

<div className="app">

<div className="overlay">

<div className="content">

<img
src={logo}
alt="logo"
className="logo"
/>

<h1>
Manjuyod Waterworks
</h1>

<p className="subtitle">

Empowering the municipality
through sustainable
water management.

</p>

<div className="card-container">

<div className="card">

<h2>
Apply for New Connection
</h2>

<button
className="primary-btn"
onClick={() =>
navigate("/application")
}
>
Begin Application
</button>

</div>

<div className="card">

<h2>
Resident Portal
</h2>

<button
className="secondary-btn"
onClick={() =>
navigate("/portal")
}
>
Portal Access
</button>

</div>

<div className="card">

<h2>
Administrator Access
</h2>

<button
className="primary-btn"
onClick={() =>
navigate("/admin-login")
}
>
Admin Login
</button>

</div>

</div>

</div>

<footer>

© 2026 Manjuyod
Waterworks System

</footer>

</div>

</div>

);

}
