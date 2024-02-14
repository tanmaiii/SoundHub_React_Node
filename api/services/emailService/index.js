import nodemailer from "nodemailer";
import template from "./template";

export const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.MAIL_NAME}`,
    pass: `${process.env.MAIL_PASSWORD}`,
  },
});

export const sendEmail = async (to, subject, html) => {
  const msg = { from: "", to, subject, html };
  await transport.sendMail(msg);
};

export const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset password";
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const html = template.resetPassword(resetPasswordUrl, "music");
  await sendEmail(to, subject, html);
};
