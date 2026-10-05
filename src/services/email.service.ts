// =============================================================================
// EMAIL SERVICE
// High-level service for sending transactional & notification emails
// =============================================================================

import { sendEmail, SendMailResult } from "@/lib/email/mailer";
import {
  getWelcomeEmailHtml,
  getPasswordChangedEmailHtml,
  getTestEmailHtml,
  getAnalysisReadyEmailHtml,
  getVerificationEmailHtml,
  getPasswordResetEmailHtml,
} from "@/lib/email/templates";
import { prisma } from "@/lib/prisma";

export class EmailService {
  /**
   * Sends an email verification link to user.
   */
  async sendVerificationEmail(to: string, name: string, verifyUrl: string): Promise<SendMailResult> {
    return sendEmail({
      to,
      subject: "Verify Your Email Address — NAMENOLOGY",
      html: getVerificationEmailHtml(name, verifyUrl),
    });
  }

  /**
   * Sends a password reset link to user.
   */
  async sendPasswordResetEmail(to: string, name: string, resetUrl: string): Promise<SendMailResult> {
    return sendEmail({
      to,
      subject: "Reset Your Password — NAMENOLOGY",
      html: getPasswordResetEmailHtml(name, resetUrl),
    });
  }

  /**
   * Sends a welcome email to newly registered users if they opted into notifications.
   */
  async sendWelcomeEmail(to: string, name: string): Promise<SendMailResult> {
    return sendEmail({
      to,
      subject: "Welcome to NAMENOLOGY — The Science of Name",
      html: getWelcomeEmailHtml(name),
    });
  }

  /**
   * Sends a security alert email when user changes password.
   */
  async sendPasswordChangedEmail(to: string, name: string): Promise<SendMailResult> {
    return sendEmail({
      to,
      subject: "Security Alert: Password Updated — NAMENOLOGY",
      html: getPasswordChangedEmailHtml(name),
    });
  }

  /**
   * Sends a test verification email from the Account Settings page.
   */
  async sendTestEmail(to: string, name: string): Promise<SendMailResult> {
    return sendEmail({
      to,
      subject: "Email Notification System Test — NAMENOLOGY",
      html: getTestEmailHtml(name, to),
    });
  }

  /**
   * Sends an analysis ready email notification if user has notifyEmail / receiveNotifications enabled.
   */
  async sendAnalysisReadyEmail(
    userId: string,
    to: string,
    name: string,
    analyzedName: string,
    score: number,
    reportUrl: string
  ): Promise<SendMailResult | null> {
    // Check if user has opted into email notifications
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { receiveNotifications: true, notifyEmail: true },
    });

    if (user && (!user.receiveNotifications || !user.notifyEmail)) {
      console.log(`Skipping analysis email for user ${userId} (opted out of email notifications)`);
      return null;
    }

    return sendEmail({
      to,
      subject: `Your Name Analysis Report is Ready: "${analyzedName}" (${score}/100) — NAMENOLOGY`,
      html: getAnalysisReadyEmailHtml(name, analyzedName, score, reportUrl),
    });
  }
}

export const emailService = new EmailService();
