const nodemailer = require("nodemailer");

async function sendOtpEmailUtil(email, otp) {

    
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: "avminh824@gmail.com",
            pass: "gqgh adln gmjs okid",
        },
    });
    const html = `<h3>Hi,</h3><br>
      <p>Please use the following One Time Password (OTP) to access the form: <b>${otp}</b>. Do not share this OTP with any</b><br>
      <b>Thank you</p>
    `;
    const info = await transporter.sendMail({
        from: '"ChatApp 👻" <avminh824@gmail.com>', // sender address
        to: email,
        subject: `Success ✔`,
        text: "Hello world?", // plain text body
        html: html, // html body
    });
}

module.exports = { sendOtpEmailUtil }