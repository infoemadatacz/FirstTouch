/**
 * Cloudflare Pages Function — POST /api/leads
 *
 * Receives lead form submissions from firsttouch.app, validates them,
 * sends an email notification to james@firsttouch.app via Resend API,
 * forwards the lead to the ai-firm CRM webhook, and returns a JSON response.
 *
 * Required env var (set in Cloudflare Pages > Settings > Environment Variables):
 *   RESEND_API_KEY    — from resend.com
 *
 * Optional env vars:
 *   NOTIFY_EMAIL      — override recipient (default: james@firsttouch.app)
 *   FROM_EMAIL        — override sender    (default: leads@firsttouch.app)
 *   CRM_WEBHOOK_URL   — ai-firm webhook endpoint, e.g. https://vps.firsttouch.app:3847/webhook/contact
 *   CRM_WEBHOOK_SECRET — shared secret matching WEBHOOK_CONTACT_SECRET on the VPS
 */

const ALLOWED_ORIGINS = [
  "https://firsttouch.app",
  "https://www.firsttouch.app",
];

const CORS_HEADERS = (origin) => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
  "Access-Control-Max-Age": "86400",
});

export async function onRequestOptions({ request }) {
  const origin = request.headers.get("Origin") || "";
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS(origin),
  });
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("Origin") || "";
  const cors = CORS_HEADERS(origin);

  // ── Parse & validate ──────────────────────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400, cors);
  }

  const { email, name, company, role, message, source, page_url, timestamp } =
    body || {};

  const missing = [];
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) missing.push("email");
  if (!name || name.trim().length < 2) missing.push("name");
  if (!company || company.trim().length < 1) missing.push("company");
  if (!role) missing.push("role");

  if (missing.length > 0) {
    return json(
      { error: "Missing or invalid fields: " + missing.join(", ") },
      422,
      cors
    );
  }

  // ── Build email content ───────────────────────────────────────────────────
  const notifyTo = env.NOTIFY_EMAIL || "james@firsttouch.app";
  const fromEmail = env.FROM_EMAIL || "leads@firsttouch.app";
  const fromName = "FirstTouch Leads";

  const utmParts = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
    .filter((k) => body[k])
    .map((k) => `<li><strong>${k}:</strong> ${esc(body[k])}</li>`)
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New Lead — FirstTouch</title></head>
<body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111;">
  <h1 style="font-size:20px;margin-bottom:4px;">🎯 New Lead from firsttouch.app</h1>
  <p style="color:#555;font-size:13px;margin-top:0;">${esc(timestamp || new Date().toISOString())}</p>

  <table style="width:100%;border-collapse:collapse;margin-top:16px;">
    <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;width:120px;">Name</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${esc(name)}</td></tr>
    <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Email</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
    <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Company</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${esc(company)}</td></tr>
    <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Role</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${esc(role)}</td></tr>
    ${
      message
        ? `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;vertical-align:top;">Message</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;white-space:pre-line;">${esc(message)}</td></tr>`
        : ""
    }
  </table>

  ${
    utmParts
      ? `<details style="margin-top:16px;"><summary style="cursor:pointer;color:#777;font-size:12px;">UTM / Attribution</summary>
    <ul style="font-size:12px;color:#555;">${utmParts}</ul></details>`
      : ""
  }

  ${
    page_url
      ? `<p style="font-size:12px;color:#888;margin-top:16px;">Source page: <a href="${esc(page_url)}">${esc(page_url)}</a>${source ? ` · ${esc(source)}` : ""}</p>`
      : ""
  }

  <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
  <p style="font-size:11px;color:#aaa;">Sent by the FirstTouch lead capture system · firsttouch.app</p>
</body>
</html>`;

  const textBody = [
    "New lead from firsttouch.app",
    "---",
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Company: ${company}`,
    `Role:    ${role}`,
    message ? `Message: ${message}` : null,
    `Time:    ${timestamp || new Date().toISOString()}`,
    page_url ? `Page:    ${page_url}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  // ── Send via Resend ───────────────────────────────────────────────────────
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    // RESEND_API_KEY not configured — log full lead payload so it appears in
    // Cloudflare Pages > Functions > Real-time logs and is not silently lost.
    console.error(
      "[leads] RESEND_API_KEY env var not set — lead data below (set key in CF Pages > Settings > Env Vars):",
      JSON.stringify({ name, email, company, role, message, page_url, timestamp })
    );
    // Still return 200 so the user reaches thank-you.html; admin must check CF logs.
    return json({ ok: true, warn: "email_not_configured" }, 200, cors);
  }

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${fromName} <${fromEmail}>`,
      to: [notifyTo],
      reply_to: email,
      subject: `🎯 New lead: ${name} @ ${company}`,
      html,
      text: textBody,
    }),
  });

  // ── Forward to CRM webhook (fire-and-forget, non-blocking) ──────────────
  // Runs regardless of Resend success — CRM must always receive the lead.
  const crmUrl = env.CRM_WEBHOOK_URL;
  if (crmUrl) {
    const crmSecret = env.CRM_WEBHOOK_SECRET;
    const crmPayload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company.trim(),
      role,
      message: message || "",
      source: source || "lp-lead-form",
      page_url: page_url || "",
      timestamp: timestamp || new Date().toISOString(),
      utm_source: body.utm_source || "",
      utm_medium: body.utm_medium || "",
      utm_campaign: body.utm_campaign || "",
    };
    if (crmSecret) {
      crmPayload._token = crmSecret;
    }
    fetch(crmUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(crmPayload),
    }).catch((err) => {
      console.error("[leads] CRM webhook forward failed:", err?.message);
    });
  }

  if (!resendRes.ok) {
    const errBody = await resendRes.json().catch(() => ({}));
    console.error("[leads] Resend error", resendRes.status, errBody);
    return json({ ok: true, warn: "notification_failed" }, 200, cors);
  }

  return json({ ok: true }, 200, cors);
}

// ── Helpers ────────────────────────────────────────────────────────────────
function json(data, status, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
