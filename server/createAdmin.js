const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    // Optional: prevent duplicate admin creation
    const existingAdmin = await Admin.findOne({
      email: "admin@gmail.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin (FIX: added required 'name')
    const admin = new Admin({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
    });

    await admin.save();

    console.log("Admin Created Successfully");

    mongoose.connection.close();
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });
