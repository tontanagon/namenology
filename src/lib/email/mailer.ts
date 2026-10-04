// =============================================================================
// EMAIL MAILER UTILITY
// Configurable SMTP transporter with development fallback & test account support
// =============================================================================

import nodemailer, { Transporter } from "nodemailer";

let cachedTransporter: Transporter | null = null;

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendMailResult {
  success: boolean;
  messageId?: string;
  previewUrl?: string | false;
  error?: string;
}

/**
 * Initializes and caches the nodemailer transporter.
 */
async function getTransporter(): Promise<Transporter> {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (host && user && pass) {
    // Production / Configured SMTP Transporter
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    });
  } else {
    // Development fallback: Use ethereal test account or console transport
    if (process.env.NODE_ENV === "production") {
      console.warn("⚠️ SMTP credentials not configured in production. Emails will be logged to console.");
      cachedTransporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    } else {
      try {
        const testAccount = await nodemailer.createTestAccount();
        cachedTransporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        console.log(`📧 Ethereal test email account initialized: ${testAccount.user}`);
      } catch {
        // Fallback to json console transport if internet/ethereal fails
        cachedTransporter = nodemailer.createTransport({
          jsonTransport: true,
        });
      }
    }
  }

  return cachedTransporter;
}

/**
 * Sends an email with HTML & text fallback.
 */
export async function sendEmail(options: SendMailOptions): Promise<SendMailResult> {
  try {
    const transporter = await getTransporter();
    const from = process.env.EMAIL_FROM || '"NAMENOLOGY" <notifications@namenology.com>';

    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text || options.html.replace(/<[^>]+>/g, ""),
      html: options.html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`📨 Email sent to ${options.to}. Preview URL: ${previewUrl}`);
    } else {
      console.log(`📨 Email sent to ${options.to} (MessageId: ${info.messageId})`);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown email error";
    console.error(`❌ Failed to send email to ${options.to}:`, errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }
}
