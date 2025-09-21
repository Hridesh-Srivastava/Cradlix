import nodemailer from "nodemailer"

const host = process.env.EMAIL_HOST
const port = Number(process.env.EMAIL_PORT || 587)
const user = process.env.EMAIL_USER
const pass = process.env.EMAIL_PASS

if (!host || !user || !pass) {
  // Keep non-fatal; API handlers can decide
  console.warn("Email environment variables are missing; emails may not be sent.")
}

export const mailer = nodemailer.createTransport({
  host,
  port,
  secure: false,
  auth: { user, pass },
})

export function renderAdminContactHtml(data: { name: string; email: string; subject?: string; message: string }) {
  const { name, email, subject, message } = data
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto">
    <h2 style="margin:0 0 16px">New Contact Submission</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px;border:1px solid #eee;width:140px"><strong>Name</strong></td><td style="padding:8px;border:1px solid #eee">${name}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee"><strong>Email</strong></td><td style="padding:8px;border:1px solid #eee">${email}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee"><strong>Subject</strong></td><td style="padding:8px;border:1px solid #eee">${subject || "(none)"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee"><strong>Message</strong></td><td style="padding:8px;border:1px solid #eee;white-space:pre-line">${message}</td></tr>
    </table>
    <p style="color:#666;margin-top:16px">This email includes an updated Excel sheet of all contact submissions as an attachment.</p>
  </div>`
}

export function renderUserThankYouHtml(name: string) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto">
    <h2 style="margin:0 0 12px">Thank you for contacting Baby Store</h2>
    <p style="color:#333">Hi ${name || "there"},</p>
    <p style="color:#333">We’ve received your message and our team will get back to you within 24 hours.</p>
    <p style="color:#666">If this wasn’t you, you can ignore this email.</p>
    <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
    <p style="color:#888;font-size:12px">This is an automated message. Please do not reply.</p>
  </div>`
}

export function renderWelcomeUserHtml(name: string) {
  const startUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/products`
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto">
    <h2 style="margin:0 0 12px">Welcome to Baby Store</h2>
    <p style="color:#333">Hi ${name || "there"},</p>
    <p style="color:#333">Your account has been created successfully. Start shopping with us!</p>
    <p style="margin:20px 0">
      <a href="${startUrl}" style="display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Start shopping</a>
    </p>
    <p style="color:#666">We’re excited to have you on board.</p>
  </div>`
}

export function renderNewUserAdminHtml(user: { name: string | null; email: string; role?: string }) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto">
    <h2 style="margin:0 0 16px">New User Registered</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px;border:1px solid #eee;width:140px"><strong>Name</strong></td><td style="padding:8px;border:1px solid #eee">${user.name || "(unknown)"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee"><strong>Email</strong></td><td style="padding:8px;border:1px solid #eee">${user.email}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee"><strong>Role</strong></td><td style="padding:8px;border:1px solid #eee">${user.role || "customer"}</td></tr>
    </table>
    <p style="color:#666;margin-top:16px">The latest Excel of all users is attached.</p>
  </div>`
}
