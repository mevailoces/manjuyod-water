const nodemailer = require("nodemailer");

const transporter =
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

const sendApprovalEmail = async (
  recipientEmail,
  fullName
) => {

  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: recipientEmail,

    subject:
      "Manjuyod Waterworks Application Approved",

    html: `
      <h2>Application Approved</h2>

      <p>
        Dear ${fullName},
      </p>

      <p>
        Your application for water service
        has been approved by the
        Manjuyod Waterworks Department.
      </p>

      <p>
        You may now access the Resident
        Portal using your registered
        email and password.
      </p>

      <p>
        Thank you for using our service.
      </p>

      <br>

      <strong>
        Manjuyod Waterworks Department
      </strong>
    `,
  });

};

module.exports = {
  sendApprovalEmail,
};
