const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const multer = require("multer");

const path = require("path");

const router = express.Router();

const User = require("../models/User");

const Admin = require("../models/Admin");

const Notification =
  require("../models/Notification");

/* =========================
MULTER CONFIG
========================= */

const storage =
  multer.diskStorage({

    destination:
      function (
        req,
        file,
        cb
      ) {

        cb(
          null,
          "uploads/"
        );

      },

    filename:
      function (
        req,
        file,
        cb
      ) {

        cb(
          null,
          Date.now() +
            path.extname(
              file.originalname
            )
        );

      },

  });

const upload =
  multer({
    storage,
  });

/* =========================
REGISTER
========================= */

router.post(
  "/register",

  upload.single("validId"),

  async (req, res) => {

    try {

      const {

        fullName,
        contactNumber,
        email,
        address,
        landmark,
        connectionType,
        password,

      } = req.body;

      const validId =
        req.file
          ? req.file.filename
          : "";

      /* CHECK EXISTING USER */

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {

        return res.status(400).json({
          message:
            "Email already exists",
        });

      }

      /* HASH PASSWORD */

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      /* GENERATE ACCOUNT NUMBER */

      const accountNumber =
        "MWS-" +
        Math.floor(
          10000 +
          Math.random() * 90000
        );

      /* CREATE USER */

      const newUser =
        new User({

          fullName,

          contactNumber,

          email,

          address,

          landmark,

          connectionType,

          accountNumber,

          validId,

          password:
            hashedPassword,

          applicationStatus:
            "Pending",

        });

      await newUser.save();

      /* CREATE NOTIFICATION */

      await Notification.create({

        message:
          `${fullName} submitted a new application.`,

        type:
          "application",

      });

      res.status(201).json({

        message:
          "Application submitted successfully",

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }

  }
);

/* =========================
USER LOGIN
========================= */

router.post(
  "/login",

  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {

        return res.status(400).json({
          message:
            "User not found",
        });

      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res.status(400).json({
          message:
            "Invalid password",
        });

      }

      /* TOKEN */

      const token =
        jwt.sign(

          {
            id: user._id,
            role: "user",
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "7d",
          }

        );

      /* RETURN USER DATA */

      res.status(200).json({

        message:
          "Login successful",

        token,

        user: {

          _id:
            user._id,

          fullName:
            user.fullName,

          email:
            user.email,

          contactNumber:
            user.contactNumber,

          address:
            user.address,

          landmark:
            user.landmark,

          connectionType:
            user.connectionType,

          accountNumber:
            user.accountNumber,

          applicationStatus:
            user.applicationStatus,

          validId:
            user.validId,

        },

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }

  }
);

/* =========================
ADMIN LOGIN
========================= */

router.post(
  "/admin-login",

  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      const admin =
        await Admin.findOne({
          email,
        });

      if (!admin) {

        return res.status(400).json({
          message:
            "Admin not found",
        });

      }

      const isMatch =
        await bcrypt.compare(
          password,
          admin.password
        );

      if (!isMatch) {

        return res.status(400).json({
          message:
            "Wrong password",
        });

      }

      const token =
        jwt.sign(

          {
            id: admin._id,
            role: "admin",
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "7d",
          }

        );

      res.status(200).json({

        message:
          "Admin Login Success",

        token,

        admin,

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }

  }
);

module.exports = router;
