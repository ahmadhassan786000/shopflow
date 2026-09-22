import nodemailer from "nodemailer";

const emailServer = process.env.EMAIL_SERVER;
const emailFrom = process.env.EMAIL_FROM;

if (!emailServer) {
  throw new Error("EMAIL_SERVER is not configured.");
}

if (!emailFrom) {
  throw new Error("EMAIL_FROM is not configured.");
}

const transporter = nodemailer.createTransport(emailServer);

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
) {
  await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject: "Reset your ShopFlow password",
    text: `Reset your ShopFlow password using this link:\n\n${resetUrl}\n\nThis link expires in 1 hour.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset your ShopFlow password</h2>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          Click the button below to create a new password:
        </p>

        <p>
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #0d6efd;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Reset Password
          </a>
        </p>

        <p>
          This link will expire in 1 hour.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore this email.
        </p>

        <p>
          — ShopFlow
        </p>
      </div>
    `,
  });
}