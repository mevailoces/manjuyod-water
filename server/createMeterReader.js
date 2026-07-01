const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const hashedPassword = await bcrypt.hash(
      "meter123",
      10
    );

    await Admin.create({
      name: "Meter Reader",
      email: "meterreader@gmail.com",
      password: hashedPassword,
      role: "meterReader",
    });

    console.log("Meter reader account created");
    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
