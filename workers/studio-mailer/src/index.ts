interface EmailAddress {
  email: string;
  name?: string;
}

interface EmailMessageBuilder {
  to: string | EmailAddress | (string | EmailAddress)[];
  from: string | EmailAddress;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string | EmailAddress;
}

interface SendEmailBinding {
  send(message: EmailMessageBuilder): Promise<{ messageId: string }>;
}

interface Env {
  EMAIL?: SendEmailBinding;
  STUDIO_DELIVERY_TO?: string;
  STUDIO_SENDER?: string;
}

interface StudioRequestPayload {
  version: 1;
  requestId: string;
  submittedAt: string;
  serviceId: string;
  serviceLabel: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
}

const MAX_BODY_BYTES = 20_000;
const emailPattern = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBoundedString(value: unknown, maxLength: number, required = false, multiline = false): value is string {
  const unsafeCharacters = multiline
    ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/
    : /[\u0000-\u001f\u007f\u2028\u2029]/;

  return (
    typeof value === "string" &&
    value.length <= maxLength &&
    (!required || value.trim().length > 0) &&
    !unsafeCharacters.test(value)
  );
}

function isValidPayload(value: unknown): value is StudioRequestPayload {
  if (!isRecord(value)) return false;

  const expectedKeys = [
    "version",
    "requestId",
    "submittedAt",
    "serviceId",
    "serviceLabel",
    "date",
    "time",
    "name",
    "email",
    "phone",
    "company",
    "notes",
  ];

  if (Object.keys(value).length !== expectedKeys.length || expectedKeys.some((key) => !(key in value))) {
    return false;
  }

  return (
    value.version === 1 &&
    isBoundedString(value.requestId, 64, true) &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.requestId) &&
    isBoundedString(value.submittedAt, 40, true) &&
    !Number.isNaN(Date.parse(value.submittedAt)) &&
    isBoundedString(value.serviceId, 40, true) &&
    /^[a-z0-9-]+$/.test(value.serviceId) &&
    isBoundedString(value.serviceLabel, 180, true) &&
    isBoundedString(value.date, 10, true) &&
    /^\d{4}-\d{2}-\d{2}$/.test(value.date) &&
    isBoundedString(value.time, 5, true) &&
    /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value.time) &&
    isBoundedString(value.name, 120, true) &&
    isBoundedString(value.email, 254, true) &&
    emailPattern.test(value.email) &&
    isBoundedString(value.phone, 50) &&
    isBoundedString(value.company, 160) &&
    isBoundedString(value.notes, 1_000, false, true)
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function htmlValue(value: string, fallback = "Not provided"): string {
  const rendered = value.trim() || fallback;
  return escapeHtml(rendered).replace(/\n/g, "<br>");
}

function textValue(value: string, fallback = "Not provided"): string {
  return value.trim() || fallback;
}

function safeSubjectPart(value: string): string {
  return value.replace(/[\r\n\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestUrl = new URL(request.url);
    if (request.method !== "POST" || requestUrl.pathname !== "/send") {
      return jsonResponse({ success: false }, 404);
    }

    const contentLength = Number(request.headers.get("Content-Length") || "0");
    if (!Number.isFinite(contentLength) || contentLength > MAX_BODY_BYTES) {
      return jsonResponse({ success: false }, 413);
    }

    if (!request.headers.get("Content-Type")?.startsWith("application/json")) {
      return jsonResponse({ success: false }, 415);
    }

    if (!env.EMAIL || !env.STUDIO_DELIVERY_TO || !env.STUDIO_SENDER) {
      return jsonResponse({ success: false }, 503);
    }

    const deliveryTo = env.STUDIO_DELIVERY_TO.trim();
    const sender = env.STUDIO_SENDER.trim();
    if (!emailPattern.test(deliveryTo) || !emailPattern.test(sender)) {
      return jsonResponse({ success: false }, 503);
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ success: false }, 400);
    }

    if (!isValidPayload(payload)) return jsonResponse({ success: false }, 400);

    const subject = `Studio request — ${safeSubjectPart(payload.date)} — ${safeSubjectPart(payload.serviceLabel)}`;
    const text = [
      "A new studio request was submitted through watervalleyvoice.com.",
      "",
      `Request ID: ${payload.requestId}`,
      `Submitted: ${payload.submittedAt}`,
      "",
      `Service: ${payload.serviceLabel}`,
      `Preferred date: ${payload.date}`,
      `Preferred start time: ${payload.time}`,
      "",
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Phone: ${textValue(payload.phone)}`,
      `Company / show: ${textValue(payload.company)}`,
      "",
      "Session details:",
      textValue(payload.notes),
      "",
      "This is a request only. The session is not reserved until Water Valley Voice confirms availability.",
    ].join("\n");

    const html = `
      <h1>New studio request</h1>
      <p>A new studio request was submitted through watervalleyvoice.com.</p>
      <table role="presentation" cellpadding="6" cellspacing="0" style="border-collapse:collapse">
        <tr><th align="left">Request ID</th><td>${htmlValue(payload.requestId)}</td></tr>
        <tr><th align="left">Submitted</th><td>${htmlValue(payload.submittedAt)}</td></tr>
        <tr><th align="left">Service</th><td>${htmlValue(payload.serviceLabel)}</td></tr>
        <tr><th align="left">Preferred date</th><td>${htmlValue(payload.date)}</td></tr>
        <tr><th align="left">Preferred start time</th><td>${htmlValue(payload.time)}</td></tr>
        <tr><th align="left">Name</th><td>${htmlValue(payload.name)}</td></tr>
        <tr><th align="left">Email</th><td>${htmlValue(payload.email)}</td></tr>
        <tr><th align="left">Phone</th><td>${htmlValue(payload.phone)}</td></tr>
        <tr><th align="left">Company / show</th><td>${htmlValue(payload.company)}</td></tr>
      </table>
      <h2>Session details</h2>
      <p>${htmlValue(payload.notes)}</p>
      <p><strong>This is a request only.</strong> The session is not reserved until Water Valley Voice confirms availability.</p>
    `.trim();

    try {
      await env.EMAIL.send({
        to: deliveryTo,
        from: { email: sender, name: "Water Valley Voice Website" },
        replyTo: { email: payload.email, name: payload.name },
        subject,
        text,
        html,
      });
    } catch {
      return jsonResponse({ success: false }, 502);
    }

    return jsonResponse({ success: true });
  },
};
