import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || "All Booked <onboarding@resend.dev>";

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  // No API key configured (e.g. local dev without .env set up) — log instead
  // of failing, so the reset flow is still testable without real email.
  if (!resend) {
    console.log(`[email] Password reset link for ${to}: ${resetUrl}`);
    return;
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your All Booked password",
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #2b1d14;">
        <h2 style="margin-bottom: 4px;">Reset your password</h2>
        <p>Someone (hopefully you) asked to reset the password on your All Booked account.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background: #7a1f1f; color: #f6ecd9; text-decoration: none; border-radius: 2px;">
            Choose a new password
          </a>
        </p>
        <p style="font-size: 13px; color: #6b5a48;">
          This link expires in 1 hour. If you didn't request this, you can safely ignore this
          email — your password won't be changed.
        </p>
      </div>
    `,
    text: `Reset your All Booked password: ${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, you can ignore this email.`,
  });
}
