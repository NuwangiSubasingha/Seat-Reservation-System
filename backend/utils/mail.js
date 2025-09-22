import nodemailer from "nodemailer";

export const sendBookingEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // this is the app password
      },
    });

    await transporter.sendMail({
      from: `"SLT mobitel Booking" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Booking confirmation email sent");
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
  }
};
