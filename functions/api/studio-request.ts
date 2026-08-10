import { studioServiceById } from "../../src/data/studio-services";

interface StudioMailerBinding {
  fetch(input: Request | string, init?: RequestInit): Promise<Response>;
}

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_ALLOWED_HOSTNAMES?: string;
  STUDIO_MAILER?: StudioMailerBinding;
}

interface PagesContext {
  request: Request;
  env: Env;
}

interface TurnstileVerification {
  success: boolean;
  action?: string;
  hostname?: string;
}

interface MailerResult {
  success?: boolean;
}

const MAX_BODY_BYTES = 20_000;
const MIN_FORM_FILL_MS = 2_500;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1_000;
const TURNSTILE_ACTION = "studio_request";

const expectedFields = new Set([
  "service",
  "date",
  "time",
  "name",
  "email",
  "phone",
  "company",
  "notes",
  "confirmation",
  "website",
  "startedAt",
  "cf-turnstile-response",
]);

const defaultAllowedHostnamePatterns = [
  "watervalleyvoice.com",
  "www.watervalleyvoice.com",
  "water-valley-voice.pages.dev",
  "*.water-valley-voice.pages.dev",
  "localhost",
  "127.0.0.1",
];

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

function failure(message: string, status = 400): Response {
  return jsonResponse({ success: false, message }, status);
}

function getAllowedHostnamePatterns(value?: string): string[] {
  if (!value?.trim()) return defaultAllowedHostnamePatterns;

  const configured = value
    .split(",")
    .map((entry) => entry.trim().toLowerCase().replace(/\.$/, ""))
    .filter(Boolean);

  return configured.length > 0 ? configured : defaultAllowedHostnamePatterns;
}

function matchesHostname(hostname: string, patterns: string[]): boolean {
  const normalizedHostname = hostname.trim().toLowerCase().replace(/\.$/, "");

  return patterns.some((pattern) => {
    if (pattern.startsWith("*.")) {
      const base = pattern.slice(2);
      return normalizedHostname.length > base.length && normalizedHostname.endsWith(`.${base}`);
    }

    return normalizedHostname === pattern;
  });
}

function hasTrustedOrigin(request: Request, allowedHostnames: string[]): boolean {
  const originHeader = request.headers.get("Origin");
  if (!originHeader) return false;

  try {
    const origin = new URL(originHeader);
    const requestUrl = new URL(request.url);
    const localHost = origin.hostname === "localhost" || origin.hostname === "127.0.0.1";
    const allowedProtocol = origin.protocol === "https:" || (localHost && origin.protocol === "http:");

    return (
      allowedProtocol &&
      origin.host === requestUrl.host &&
      matchesHostname(origin.hostname, allowedHostnames) &&
      matchesHostname(requestUrl.hostname, allowedHostnames)
    );
  } catch {
    return false;
  }
}

function singleString(formData: FormData, field: string, required = true): string | null {
  const values = formData.getAll(field);
  if (values.length === 0 && !required) return "";
  if (values.length !== 1 || typeof values[0] !== "string") return null;
  return values[0];
}

function isSingleLine(value: string): boolean {
  return !/[\u0000-\u001f\u007f\u2028\u2029]/.test(value);
}

function isValidCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
}

function getDenverToday(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = new Map(parts.map((part) => [part.type, part.value]));
  return `${values.get("year")}-${values.get("month")}-${values.get("day")}`;
}

async function verifyTurnstile(
  secret: string,
  token: string,
  remoteIp: string | null,
): Promise<TurnstileVerification | null> {
  const body = new URLSearchParams({
    secret,
    response: token,
    idempotency_key: crypto.randomUUID(),
  });

  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) return null;
    return (await response.json()) as TurnstileVerification;
  } catch {
    return null;
  }
}

export const onRequest = async ({ request, env }: PagesContext): Promise<Response> => {
  if (request.method !== "POST") {
    return jsonResponse({ success: false, message: "Method not allowed." }, 405);
  }

  const contentLength = Number(request.headers.get("Content-Length") || "0");
  if (!Number.isFinite(contentLength) || contentLength > MAX_BODY_BYTES) {
    return failure("The request is too large.", 413);
  }

  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.startsWith("multipart/form-data") && !contentType.startsWith("application/x-www-form-urlencoded")) {
    return failure("The request format is not supported.", 415);
  }

  const allowedHostnames = getAllowedHostnamePatterns(env.TURNSTILE_ALLOWED_HOSTNAMES);
  if (!hasTrustedOrigin(request, allowedHostnames)) {
    return failure("We could not verify where this request came from. Please refresh the page and try again.", 403);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return failure("We could not read the form. Please refresh the page and try again.");
  }

  const encoder = new TextEncoder();
  let parsedBodyBytes = 0;
  formData.forEach((value, key) => {
    parsedBodyBytes += encoder.encode(key).byteLength;
    parsedBodyBytes += typeof value === "string" ? encoder.encode(value).byteLength : value.size;
  });
  if (parsedBodyBytes > MAX_BODY_BYTES) return failure("The request is too large.", 413);

  let hasUnexpectedField = false;
  formData.forEach((_value, key) => {
    if (!expectedFields.has(key)) hasUnexpectedField = true;
  });
  if (hasUnexpectedField) return failure("The form contains an unsupported field.");

  const website = singleString(formData, "website", false);
  if (website === null || website.trim() !== "") {
    return failure("We could not verify this request.", 403);
  }

  const startedAtValue = singleString(formData, "startedAt");
  if (!startedAtValue || !/^\d{13}$/.test(startedAtValue)) {
    return failure("This form has expired. Please refresh the page and try again.");
  }

  const formAge = Date.now() - Number(startedAtValue);
  if (!Number.isFinite(formAge) || formAge < MIN_FORM_FILL_MS || formAge > MAX_FORM_AGE_MS) {
    return failure("This form has expired. Please refresh the page and try again.");
  }

  const serviceId = singleString(formData, "service");
  const service = serviceId ? studioServiceById.get(serviceId) : undefined;
  if (!service || !serviceId || serviceId.length > 40) return failure("Please choose a valid studio service.");

  const date = singleString(formData, "date");
  if (!date || date.length !== 10 || !isValidCalendarDate(date) || date < getDenverToday()) {
    return failure("Please choose a valid future date.");
  }

  const time = singleString(formData, "time");
  if (!time || time.length !== 5 || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return failure("Please choose a valid start time.");
  }

  const nameValue = singleString(formData, "name");
  const name = nameValue?.trim() || "";
  if (name.length < 1 || name.length > 120 || !isSingleLine(name)) {
    return failure("Please enter a valid name.");
  }

  const emailValue = singleString(formData, "email");
  const email = emailValue?.trim() || "";
  if (email.length < 3 || email.length > 254 || !isSingleLine(email) || !emailPattern.test(email)) {
    return failure("Please enter a valid email address.");
  }

  const phoneValue = singleString(formData, "phone", false);
  const phone = phoneValue?.trim() || "";
  if (phone.length > 50 || !isSingleLine(phone)) return failure("Please enter a valid phone number.");

  const companyValue = singleString(formData, "company", false);
  const company = companyValue?.trim() || "";
  if (company.length > 160 || !isSingleLine(company)) return failure("Please enter a valid company or show name.");

  const notesValue = singleString(formData, "notes", false);
  const notes = (notesValue || "").trim().replace(/\r\n?/g, "\n");
  if (notes.length > 1_000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(notes)) {
    return failure("Please shorten or revise the session details.");
  }

  const confirmation = singleString(formData, "confirmation");
  if (confirmation !== "on") return failure("Please confirm that you understand this is a booking request.");

  const turnstileToken = singleString(formData, "cf-turnstile-response");
  if (!turnstileToken || turnstileToken.length > 2_048) {
    return failure("Please complete the security check.", 403);
  }

  if (!env.TURNSTILE_SECRET_KEY || !env.STUDIO_MAILER) {
    return failure("Studio requests are temporarily unavailable. Please try again later.", 503);
  }

  const verification = await verifyTurnstile(
    env.TURNSTILE_SECRET_KEY,
    turnstileToken,
    request.headers.get("CF-Connecting-IP"),
  );

  if (
    !verification?.success ||
    verification.action !== TURNSTILE_ACTION ||
    !verification.hostname ||
    !matchesHostname(verification.hostname, allowedHostnames)
  ) {
    return failure("The security check could not be verified. Please try again.", 403);
  }

  const requestId = crypto.randomUUID();
  const mailerRequest = new Request("https://studio-mailer.internal/send", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      version: 1,
      requestId,
      submittedAt: new Date().toISOString(),
      serviceId: service.id,
      serviceLabel: service.requestLabel,
      date,
      time,
      name,
      email,
      phone,
      company,
      notes,
    }),
  });

  let mailerResponse: Response;
  try {
    mailerResponse = await env.STUDIO_MAILER.fetch(mailerRequest);
  } catch {
    return failure("We could not send your request right now. Please try again in a few minutes.", 502);
  }

  let mailerResult: MailerResult | null = null;
  try {
    mailerResult = (await mailerResponse.json()) as MailerResult;
  } catch {
    mailerResult = null;
  }

  if (!mailerResponse.ok || mailerResult?.success !== true) {
    return failure("We could not send your request right now. Please try again in a few minutes.", 502);
  }

  return jsonResponse({
    success: true,
    message: "Thank you. Your studio request has been sent, and our team will reply by email.",
  });
};
