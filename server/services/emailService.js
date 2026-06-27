const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendRegistrationEmail = async (email, fullName) => {
  await transporter.sendMail({
    from: `"Manjuyod Waterworks" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Application Received - Manjuyod Waterworks",
    html: `
      <h2>Application Received</h2>

      <p>Dear <b>${fullName}</b>,</p>

      <p>
        Thank you for registering with the Manjuyod Waterworks Online
        Application and Monitoring System.
      </p>

      <p>
        Your application has been successfully received and is now pending
        review by the Waterworks Administrator.
      </p>

      <p>
        You will receive another notification once your application is approved
        or rejected.
      </p>

      <br />

      <p>Thank you,</p>
      <b>Manjuyod Waterworks Office</b>
    `,
  });
};

module.exports = {
  sendRegistrationEmail,
};
