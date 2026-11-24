import "server-only";

/**
 * Sends a plain-text email via Resend when RESEND_API_KEY is set; otherwise logs it
 * (development). Failures never break the user's request — inquiries are always stored first.
 */
export async function sendEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "JesTech Nexus <onboarding@resend.dev>";
  if (!key) {
    console.info(`[email:dev] to=${to} subject=${subject}\n${text}`);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, text }),
    });
    if (!res.ok) console.error(`[email] Resend responded ${res.status}`);
  } catch (err) {
    console.error("[email] send failed", err);
  }
}

export function adminInbox() {
  return process.env.ADMIN_EMAIL ?? "admin@nexus.local";
}
