const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const hashedPassword = await bcrypt.hash(
      "cashier123",
      10
    );

   await Admin.create({
  name: "Cashier",
  email: "cashier@gmail.com",
  password: hashedPassword,
  role: "cashier",
});

    console.log("Cashier account created");
    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
