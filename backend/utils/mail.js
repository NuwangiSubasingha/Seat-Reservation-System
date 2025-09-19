import nodemailer from "nodemailer";

export const sendBookingEmail = async (userEmail, seatNumber, date) => {
  try {
    // Create transporter (example with Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Seat Booking Confirmation",
      html: `
        <h2>Booking Confirmed ✅</h2>
        <p>Your seat <strong>${seatNumber}</strong> has been booked for <strong>${date}</strong>.</p>
        <p>Thank you for using our booking system!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Booking email sent to", userEmail);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
