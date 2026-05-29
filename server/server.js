const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

/* =========================
   DATABASE
========================= */

mongoose
.connect(process.env.MONGO_URI)
.then(() => {
console.log("MongoDB Connected");
})
.catch((err) => {
console.log(err);
});

/* =========================
   ROUTES
========================= */

app.use("/api", authRoutes);

app.use("/api/admin", adminRoutes);

/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {

res.send("API is running");

});

/* =========================
   SERVER
========================= */

const PORT =
process.env.PORT || 5000;

app.listen(PORT, () => {

console.log(
`Server running on port ${PORT}`
);

});

app.use(
  "/uploads",
  express.static("uploads")
);
