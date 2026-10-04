// =============================================================================
// EMAIL HTML TEMPLATES — NAMENOLOGY DESIGN SYSTEM
// Clean, modern, responsive email templates in Light Cosmic style
// =============================================================================

function baseEmailLayout(title: string, bodyContent: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F8FAFF;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #F8FAFF;
      padding: 40px 16px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 20px;
      border: 1px solid #E5E9F0;
      box-shadow: 0 4px 20px rgba(11, 92, 255, 0.05);
      overflow: hidden;
    }
    .header {
      padding: 32px 32px 24px;
      text-align: center;
      border-bottom: 1px solid #EEF2F7;
      background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%);
    }
    .logo-text {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #0B5CFF;
      text-decoration: none;
    }
    .logo-suffix {
      background: linear-gradient(135deg, #0B5CFF 0%, #4F46E5 50%, #7C3AED 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: #6366F1;
    }
    .tagline {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #64748B;
      margin-top: 6px;
    }
    .content {
      padding: 32px;
      font-size: 15px;
      line-height: 1.6;
      color: #334155;
    }
    .btn {
      display: inline-block;
      padding: 12px 28px;
      background: linear-gradient(135deg, #0B5CFF 0%, #4F46E5 100%);
      color: #FFFFFF !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      border-radius: 12px;
      margin: 20px 0;
      box-shadow: 0 4px 12px rgba(11, 92, 255, 0.25);
    }
    .pill {
      display: inline-block;
      padding: 4px 12px;
      background-color: #EFF6FF;
      border: 1px solid #BFDBFE;
      color: #1D4ED8;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .footer {
      padding: 24px 32px;
      background-color: #F8FAFF;
      border-top: 1px solid #EEF2F7;
      text-align: center;
      font-size: 12px;
      color: #94A3B8;
      line-height: 1.5;
    }
    .footer a {
      color: #0B5CFF;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a href="${appUrl}" class="logo-text">NAME<span class="logo-suffix">NOLOGY</span></a>
        <div class="tagline">The Science of Name. The Power of Destiny.</div>
      </div>
      <div class="content">
        ${bodyContent}
      </div>
      <div class="footer">
        <p>This email was sent to you because you opted in to notifications on NAMENOLOGY.</p>
        <p>You can manage your notification preferences anytime in <a href="${appUrl}/settings">Account Settings</a>.</p>
        <p>&copy; ${new Date().getFullYear()} NAMENOLOGY. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * 1. Welcome Email
 */
export function getWelcomeEmailHtml(name: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const body = `
    <div class="pill">Welcome to NAMENOLOGY</div>
    <h2 style="margin: 0 0 16px; color: #0F172A; font-size: 22px; font-weight: 800;">
      Welcome aboard, ${name}!
    </h2>
    <p>Thank you for creating your account with <strong>NAMENOLOGY</strong>. Your personal account is active and ready to explore scientific name numerology calculations.</p>
    
    <div style="background-color: #F1F5F9; border-radius: 14px; padding: 18px 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 8px; color: #1E293B; font-size: 14px; font-weight: 700;">What you can do right now:</h3>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569;">
        <li style="margin-bottom: 6px;">Perform your 2 complimentary name analyses (First Name & Surname)</li>
        <li style="margin-bottom: 6px;">Examine phonetics, tripartite component balance, and cosmic score interpretations</li>
        <li>Review your detailed calculation history and audit trails in the Dashboard</li>
      </ul>
    </div>

    <div style="text-align: center;">
      <a href="${appUrl}/dashboard" class="btn">Go to Your Dashboard</a>
    </div>

    <p style="margin-top: 24px; font-size: 13px; color: #64748B;">
      If you did not create this account, please disregard this email or contact support.
    </p>
  `;

  return baseEmailLayout("Welcome to NAMENOLOGY", body);
}

/**
 * 2. Password Changed Security Email
 */
export function getPasswordChangedEmailHtml(name: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const body = `
    <div class="pill" style="background-color: #FEF2F2; border-color: #FECACA; color: #DC2626;">Security Alert</div>
    <h2 style="margin: 0 0 16px; color: #0F172A; font-size: 22px; font-weight: 800;">
      Your password was recently changed
    </h2>
    <p>Hello ${name},</p>
    <p>This is an automated notification to confirm that the password for your NAMENOLOGY account was successfully updated on <strong>${new Date().toLocaleString("en-US", { timeZoneName: "short" })}</strong>.</p>
    
    <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 14px 18px; margin: 20px 0; border-radius: 0 10px 10px 0;">
      <p style="margin: 0; font-size: 13px; color: #991B1B; font-weight: 600;">
        Did not make this change?
      </p>
      <p style="margin: 4px 0 0; font-size: 12px; color: #B91C1C;">
        If you did not authorize this action, your account may be compromised. Please reset your password immediately or contact our support team.
      </p>
    </div>

    <div style="text-align: center;">
      <a href="${appUrl}/settings" class="btn" style="background: #0F172A;">Manage Account Security</a>
    </div>
  `;

  return baseEmailLayout("Password Change Security Notice", body);
}

/**
 * 3. Test Email Notification
 */
export function getTestEmailHtml(name: string, email: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const body = `
    <div class="pill">Email System Test</div>
    <h2 style="margin: 0 0 16px; color: #0F172A; font-size: 22px; font-weight: 800;">
      Email Notification Verification
    </h2>
    <p>Hello ${name},</p>
    <p>This is a verification email from <strong>NAMENOLOGY</strong>. Your email notification system is working properly and configured to receive updates at <strong>${email}</strong>.</p>
    
    <div style="background-color: #F8FAFF; border: 1px solid #E0E7FF; border-radius: 14px; padding: 18px 20px; margin: 20px 0;">
      <p style="margin: 0; font-size: 13px; color: #3730A3;">
        <strong>Delivery Status:</strong> Active &amp; Verified<br>
        <strong>Timestamp:</strong> ${new Date().toUTCString()}
      </p>
    </div>

    <p>You will receive email notifications based on your chosen categories (Analysis Reports, Security Alerts, and Special Offers).</p>

    <div style="text-align: center;">
      <a href="${appUrl}/settings" class="btn">Update Email Preferences</a>
    </div>
  `;

  return baseEmailLayout("Verification Test Email - NAMENOLOGY", body);
}

/**
 * 4. Analysis Report Ready Email
 */
export function getAnalysisReadyEmailHtml(name: string, analyzedName: string, score: number, reportUrl: string): string {
  const body = `
    <div class="pill">Analysis Report Ready</div>
    <h2 style="margin: 0 0 16px; color: #0F172A; font-size: 22px; font-weight: 800;">
      Your Name Analysis Report is Ready
    </h2>
    <p>Hello ${name},</p>
    <p>The cosmic science analysis calculation for "<strong>${analyzedName}</strong>" has been completed.</p>
    
    <div style="text-align: center; background: linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%); border: 1px solid #C7D2FE; border-radius: 16px; padding: 24px; margin: 24px 0;">
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #4338CA; letter-spacing: 1px;">Overall Auspicious Score</div>
      <div style="font-size: 48px; font-weight: 900; color: #1E1B4B; margin: 8px 0;">${score}<span style="font-size: 20px; color: #6366F1;">/100</span></div>
      <div style="font-size: 13px; color: #4F46E5;">Scientific Numerology &amp; Tripartite Balance</div>
    </div>

    <div style="text-align: center;">
      <a href="${reportUrl}" class="btn">View Full Analysis Report</a>
    </div>
  `;

  return baseEmailLayout(`Analysis Report: ${analyzedName}`, body);
}

/**
 * 5. Email Verification Link Template
 */
export function getVerificationEmailHtml(name: string, verifyUrl: string): string {
  const body = `
    <div class="pill">Email Verification</div>
    <h2 style="margin: 0 0 16px; color: #0F172A; font-size: 22px; font-weight: 800;">
      Verify Your Email Address
    </h2>
    <p>Hello ${name},</p>
    <p>
      Thank you for creating an account with <strong>NAMENOLOGY</strong> — The Science of Name. 
      Please confirm your email address by clicking the button below to complete your account setup and ensure uninterrupted access to your calculations and credit packages.
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${verifyUrl}" class="btn" style="padding: 14px 36px; font-size: 15px;">
        Verify Email Address
      </a>
    </div>

    <div style="background-color: #F8FAFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px 20px; margin: 24px 0;">
      <p style="margin: 0 0 6px; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">
        Button not working? Copy and paste this link into your browser:
      </p>
      <p style="margin: 0; font-size: 12px; word-break: break-all; color: #0B5CFF;">
        <a href="${verifyUrl}" style="color: #0B5CFF; text-decoration: underline;">${verifyUrl}</a>
      </p>
    </div>

    <p style="font-size: 13px; color: #64748B;">
      This verification link is valid for <strong>24 hours</strong>. If you did not sign up for NAMENOLOGY, you can safely ignore this email.
    </p>
  `;

  return baseEmailLayout("Verify Your Email Address — NAMENOLOGY", body);
}
