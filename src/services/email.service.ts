import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, code: string | undefined) => {
    try {
        if (!code) {
            throw new Error("Verification code missing");
        }

        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.BREVO_USER,
                pass: process.env.BREVO_SMTP_KEY,
            },
        });

        const mailOptions = {
            from: `"Ancart" <${process.env.BREVO_EMAIL}>`,
            to: email,
            subject: "Email verification for your account",
            html: `
                <p>To authenticate, please use the following code:</p>
                <h2 style="letter-spacing: 2px;">${code}</h2>
                <p><strong>Verification code will be valid for 10 minutes.</strong></p>
                <p>Do not share this code with anyone. If you didn't make this request, you can safely ignore this email.</p>
                <p>Thank you!</p>`
        }

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent successfully:", info.messageId);
        return true;

    } catch (error) {
        console.error("Email sending failed:", error)
        throw new Error("Failed to send verification email");
    }
};
