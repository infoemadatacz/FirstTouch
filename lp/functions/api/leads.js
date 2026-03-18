/**
 * Cloudflare Pages Function — POST /api/leads
 *
 * Receives lead form submissions from firsttouch.app, validates them,
 * sends an email notification to james@firsttouch.app via Resend API,
 * sends a confirmation email to the submitter,
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

export async function onRequestPost(context) {
  const { request, env, waitUntil } = context;
  const origin = request.headers.get("Origin") || "";
  const cors = CORS_HEADERS(origin);

  // ── Parse & validate ──────────────────────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400, cors);
  }

  const { email, name, company, role, company_size, message, source, page_url, timestamp } =
    body || {};

  // Only email and role are required — name/company removed from form (Fix 2)
  const missing = [];
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) missing.push("email");
  if (!role) missing.push("role");

  if (missing.length > 0) {
    return json(
      { error: "Missing or invalid fields: " + missing.join(", ") },
      422,
      cors
    );
  }

  // ── Build internal notification email ─────────────────────────────────────
  const notifyTo = env.NOTIFY_EMAIL || "james@firsttouch.app";
  const fromEmail = env.FROM_EMAIL || "leads@firsttouch.app";
  const fromName = "FirstTouch Leads";

  const utmParts = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
    .filter((k) => body[k])
    .map((k) => `<li><strong>${k}:</strong> ${esc(body[k])}</li>`)
    .join("\n");

  const notifyHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New Lead — FirstTouch</title></head>
<body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111;">
  <h1 style="font-size:20px;margin-bottom:4px;">🎯 New Lead from firsttouch.app</h1>
  <p style="color:#555;font-size:13px;margin-top:0;">${esc(timestamp || new Date().toISOString())}</p>

  <table style="width:100%;border-collapse:collapse;margin-top:16px;">
    <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;width:120px;">Email</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
    <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Role</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${esc(role)}</td></tr>
    ${name ? `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Name</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${esc(name)}</td></tr>` : ""}
    ${company ? `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Company</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${esc(company)}</td></tr>` : ""}
    ${company_size ? `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Company size</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${esc(company_size)} employees</td></tr>` : ""}
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

  const notifyText = [
    "New lead from firsttouch.app",
    "---",
    `Email:   ${email}`,
    `Role:    ${role}`,
    name         ? `Name:    ${name}`         : null,
    company      ? `Company: ${company}`      : null,
    company_size ? `Size:    ${company_size}` : null,
    message      ? `Message: ${message}`      : null,
    `Time:    ${timestamp || new Date().toISOString()}`,
    page_url ? `Page:    ${page_url}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  // ── Build confirmation email to submitter ─────────────────────────────────
  const confirmHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Your Strategy Toolkit — First Touch</title></head>
<body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111;background:#fff;">
  <table style="width:100%;margin-bottom:24px;">
    <tr>
      <td>
        <span style="font-size:18px;font-weight:700;color:#9301BB;">First Touch</span>
      </td>
    </tr>
  </table>

  <h1 style="font-size:22px;font-weight:700;margin-bottom:8px;color:#111;">Your AI Workflow Strategy Toolkit is here.</h1>
  <p style="color:#444;line-height:1.6;margin-bottom:20px;">
    Thanks for requesting the toolkit. You can download it using the button below — it includes a workflow bottleneck map template, an AI use-case prioritisation matrix, and an ROI calculation worksheet.
  </p>

  <a href="https://firsttouch.app/assets/strategy-toolkit.md"
     style="display:inline-block;background:#9301BB;color:#fff;font-weight:700;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:15px;margin-bottom:24px;">
    Download Strategy Toolkit →
  </a>

  <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">

  <p style="color:#444;line-height:1.6;margin-bottom:12px;">
    <strong>Best next step:</strong> Book a free 15-min call to walk through one real workflow together. We'll map the bottleneck, set governance thresholds, and define your pilot measurement plan.
  </p>

  <a href="https://calendly.com/james-harrington-firsttouch/15min"
     style="display:inline-block;background:#fff;color:#9301BB;font-weight:700;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;border:2px solid #9301BB;margin-bottom:24px;">
    Book Free 15-Min Assessment →
  </a>

  <p style="font-size:12px;color:#888;margin-top:24px;">
    You're receiving this because you requested the AI Workflow Strategy Toolkit at firsttouch.app.<br>
    Questions? Reply to this email or reach James directly at <a href="mailto:james@firsttouch.app" style="color:#9301BB;">james@firsttouch.app</a>
  </p>

  <p style="font-size:11px;color:#aaa;margin-top:8px;">First Touch · London, United Kingdom · firsttouch.app</p>
</body>
</html>`;

  const confirmText = [
    "Your AI Workflow Strategy Toolkit is here.",
    "",
    "Download it at: https://firsttouch.app/assets/strategy-toolkit.md",
    "",
    "Best next step: book a free 15-min call — https://calendly.com/james-harrington-firsttouch/15min",
    "",
    "Questions? Reply to this email or write to james@firsttouch.app",
    "",
    "First Touch · London, United Kingdom · firsttouch.app",
  ].join("\n");

  // ── Send via Resend ───────────────────────────────────────────────────────
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    // RESEND_API_KEY not configured — log full lead payload so it appears in
    // Cloudflare Pages > Functions > Real-time logs and is not silently lost.
    console.error(
      "[leads] RESEND_API_KEY env var not set — lead data below (set key in CF Pages > Settings > Env Vars):",
      JSON.stringify({ email, role, name, company, message, page_url, timestamp })
    );
    // Still return 200 so the user reaches thank-you.html; admin must check CF logs.
    return json({ ok: true, warn: "email_not_configured" }, 200, cors);
  }

  // Send internal notification to james@firsttouch.app
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
      subject: `🎯 New lead: ${email} (${role})`,
      html: notifyHtml,
      text: notifyText,
    }),
  });

  if (!resendRes.ok) {
    const errBody = await resendRes.json().catch(() => ({}));
    console.error("[leads] Resend notification error", resendRes.status, errBody);
    return json({ ok: true, warn: "notification_failed" }, 200, cors);
  }

  // Send confirmation email to submitter (fire-and-forget via waitUntil)
  waitUntil(
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `James Harrington at First Touch <${fromEmail}>`,
        to: [email],
        reply_to: notifyTo,
        subject: "Your First Touch Strategy Toolkit",
        html: confirmHtml,
        text: confirmText,
      }),
    })
      .then(async (r) => {
        if (!r.ok) {
          const errText = await r.text().catch(() => "");
          console.error(`[leads] Confirmation email failed ${r.status}: ${errText}`);
        } else {
          console.log("[leads] Confirmation email sent to", email);
        }
      })
      .catch((err) => {
        console.error("[leads] Confirmation email error:", err?.message);
      })
  );

  // ── Forward to CRM webhook ────────────────────────────────────────────────
  // MUST use waitUntil() — Cloudflare kills the execution context the moment
  // the Response is returned, so a bare fire-and-forget fetch() is never sent.
  const crmUrl = env.CRM_WEBHOOK_URL;
  if (crmUrl) {
    const crmSecret = env.CRM_WEBHOOK_SECRET;
    const crmPayload = {
      email: email.trim().toLowerCase(),
      role,
      name: name ? name.trim() : "",
      company: company ? company.trim() : "",
      company_size: company_size || "",
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
    waitUntil(
      fetch(crmUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(crmPayload),
      })
        .then(async (r) => {
          if (!r.ok) {
            const errText = await r.text().catch(() => "");
            console.error(`[leads] CRM webhook returned ${r.status}: ${errText}`);
          } else {
            console.log("[leads] CRM webhook forwarded OK");
          }
        })
        .catch((err) => {
          console.error("[leads] CRM webhook forward failed:", err?.message);
        })
    );
  } else {
    console.warn(
      "[leads] CRM_WEBHOOK_URL not set — lead not forwarded to CRM.",
      JSON.stringify({ email, role, source, timestamp })
    );
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
