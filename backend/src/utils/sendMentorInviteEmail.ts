import { sendEmail } from "../config/mailer.js";

export const sendMentorInviteEmail = async ({
    mentorName,
    mentorEmail,
    inviteLink,
    message,
}: {
    mentorName: string;
    mentorEmail: string;
    inviteLink: string;
    message?: string;
}) => {
    await sendEmail({
        to: mentorEmail,
        subject: "Mentor Invitation - AI Startup Builder",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hello ${mentorName},</h2>
        <p>You have been invited to join AI Startup Builder as a mentor.</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
        <p>Click the button below to complete your mentor profile.</p>
        <a href="${inviteLink}"
           style="display:inline-block;background:#6C4CF1;color:white;padding:12px 18px;border-radius:8px;text-decoration:none;">
          Complete Mentor Signup
        </a>
        <p style="margin-top:16px;color:#666;">This invite link may expire soon.</p>
      </div>
    `,
    });
};