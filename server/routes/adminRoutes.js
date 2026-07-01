const express = require("express");

const router = express.Router();

const User =
  require("../models/User");

const Bill =
  require("../models/Bill");

const Notification =
  require("../models/Notification");



/* =========================
   GET ALL USERS
========================= */

router.get(
  "/users",

  async (req, res) => {

    try {

      const users =
  await User.find({
    isDeleted: {
      $ne: true,
    },

    applicationStatus: {
      $in: ["Pending", "Rejected"],
    },
  }).sort({
    createdAt: -1,
  });

      res.json(users);

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
   GET APPROVED CONSUMERS
========================= */

router.get(
  "/approved-users",

  async (req, res) => {

    try {

   const users = await User.find({
  applicationStatus: "Approved",
  isDeleted: { $ne: true }
}).sort({
  createdAt: -1,
});
      console.log(users);

      res.json(users);

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
   UPDATE APPLICATION STATUS
========================= */

router.put(
"/status/:id",

async (req, res) => {


try {

  const user =
    await User.findById(
      req.params.id
    );

  if (!user) {

    return res.status(404).json({
      message:
        "User not found",
    });

  }

  user.applicationStatus =
    req.body.status;

  await user.save();

  await Notification.create({

    message:
      `${user.fullName} application was ${req.body.status}`,

    type:
      "application-status",

  });



  res.json({

    message:
      "Updated",

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
   DELETE USER
========================= */

router.delete(
  "/user/:id",
  async (req, res) => {
    try {

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (
        user.applicationStatus ===
        "Approved"
      ) {
        return res.status(400).json({
          message:
            "Approved consumers cannot be deleted.",
        });
      }

      user.isDeleted = true;

      await user.save();

      res.json({
        message:
          "Application deleted successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }
  }
);

/* =========================
   CREATE BILL
========================= */

router.post(
  "/billing/create",

  async (req, res) => {

    try {

      const {

        userId,
        accountNumber,
        previousReading,
        currentReading,
        readingDate,
        dueDate,
        meterReaderName,

      } = req.body;

      const consumption =

        Number(currentReading)

        -

        Number(previousReading);

      const amount =
        consumption * 25;

      const bill =
        await Bill.create({

          userId,
          accountNumber,
          previousReading,
          currentReading,
          consumption,
          amount,
          readingDate,
          dueDate,
          meterReaderName,

        });

      const user =
        await User.findById(
          userId
        );

      await Notification.create({

        message:
          `New bill created for ${user.fullName}`,

        type:
          "billing",

      });

      res.json(bill);

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
   GET USER BILLS
========================= */

router.get(
  "/billing/user/:userId",

  async (req, res) => {

    try {

      const bills =
        await Bill.find({

          userId:
            req.params.userId,

        })

        .sort({
          createdAt: -1,
        });

      res.json(bills);

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
   GET ALL BILLS
========================= */

router.get(
  "/billing",

  async (req, res) => {

    try {

      const bills =
        await Bill.find()

        .populate(
          "userId",
          "fullName email"
        )

        .sort({
          createdAt: -1,
        });

      res.json(bills);

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
   UPDATE BILL STATUS
========================= */

router.put(
  "/billing/status/:id",

  async (req, res) => {

    try {

      const updateData = {

        status:
          req.body.status,

      };

      if (
        req.body.status ===
        "Paid"
      ) {

        updateData.paidDate =

          new Date()
          .toISOString()
          .split("T")[0];

      }

      const updatedBill =
        await Bill.findByIdAndUpdate(

          req.params.id,

          updateData,

          {
            new: true,
          }

        )

        .populate(
          "userId",
          "fullName"
        );

      if (
        req.body.status ===
        "Paid"
      ) {

        await Notification.create({

          message:
            `${updatedBill.userId.fullName} paid ₱${updatedBill.amount}`,

          type:
            "payment",

        });

      }

      res.json({
        message:
          "Updated",
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
   GET NOTIFICATIONS
========================= */

router.get(
  "/notifications",

  async (req, res) => {

    try {

      const notifications =

        await Notification.find()

        .sort({
          createdAt: -1,
        })

        .limit(10);

      res.json(
        notifications
      );

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
