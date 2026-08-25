import nodemailer from "nodemailer";
import { logger } from "./logger";

export interface BriefingNotificationPayload {
  id: string;
  agencyName: string;
  programInterest: string;
  contactName: string;
  contactEmail: string;
  message?: string;
}

export type NotificationResult =
  | { status: "sent"; detail: string }
  | { status: "logged"; detail: string }
  | { status: "failed"; detail: string };

function buildEmailBody(payload: BriefingNotificationPayload): string {
  const lines = [
    "New agency briefing request",
    "",
    `Reference ID: ${payload.id}`,
    `Agency: ${payload.agencyName}`,
    `Program interest: ${payload.programInterest}`,
    `Contact: ${payload.contactName} <${payload.contactEmail}>`,
  ];
  if (payload.message?.trim()) {
    lines.push("", "Message:", payload.message.trim());
  }
  lines.push("", "— Advanced Creation Studio intake");
  return lines.join("\n");
}

function resolveNotifyTo(): string | undefined {
  return process.env.BRIEFING_NOTIFY_EMAIL?.trim() || undefined;
}

function createTransport() {
  const smtpUrl = process.env.SMTP_URL?.trim();
  if (smtpUrl) {
    return nodemailer.createTransport(smtpUrl);
  }

  const host = process.env.SMTP_HOST?.trim();
  if (!host) return null;

  const port = Number(process.env.SMTP_PORT ?? "587");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS ?? process.env.SMTP_PASSWORD;

  return nodemailer.createTransport({
    host,
    port: Number.isFinite(port) ? port : 587,
    secure,
    auth: user ? { user, pass: pass ?? "" } : undefined,
  });
}

/**
 * Notify ACS staff about a new briefing request.
 * When SMTP is not configured, logs the payload so local/dev still works.
 */
export async function notifyBriefingRequest(
  payload: BriefingNotificationPayload,
): Promise<NotificationResult> {
  const to = resolveNotifyTo();
  const transport = createTransport();
  const subject = `Briefing request: ${payload.agencyName}`;
  const text = buildEmailBody(payload);

  if (!transport || !to) {
    logger.info(
      {
        briefingRequestId: payload.id,
        notifyTo: to ?? null,
        smtpConfigured: Boolean(transport),
        subject,
        preview: text,
      },
      "Briefing notification logged (SMTP or BRIEFING_NOTIFY_EMAIL not configured)",
    );
    return {
      status: "logged",
      detail: !to
        ? "BRIEFING_NOTIFY_EMAIL not set; notification logged only"
        : "SMTP not configured; notification logged only",
    };
  }

  const from =
    process.env.BRIEFING_NOTIFY_FROM?.trim() ||
    process.env.SMTP_FROM?.trim() ||
    process.env.SMTP_USER?.trim() ||
    "noreply@advancedcreationstudio.com";

  try {
    const info = await transport.sendMail({
      from,
      to,
      replyTo: payload.contactEmail,
      subject,
      text,
    });
    logger.info(
      {
        briefingRequestId: payload.id,
        messageId: info.messageId,
        to,
      },
      "Briefing notification email sent",
    );
    return { status: "sent", detail: `Email sent to ${to}` };
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Unknown email error";
    logger.error(
      { err, briefingRequestId: payload.id, to },
      "Failed to send briefing notification email",
    );
    return { status: "failed", detail };
  }
}
