// =============================================================================
// UNIT TESTS: NOTIFICATION PREFERENCES & LOGIC
// =============================================================================

import { describe, it, expect, vi } from "vitest";

describe("Notification Logic Unit Tests", () => {
  it("determines whether to dispatch notification based on user preferences", () => {
    const shouldDispatch = (
      userPref: { receiveNotifications: boolean; notifyEmail: boolean; notifyMarketing: boolean },
      notificationType: "SYSTEM" | "ALERT" | "INFO" | "PROMO"
    ) => {
      // Critical security/system alerts are always sent
      if (notificationType === "SYSTEM" || notificationType === "ALERT") {
        return true;
      }

      // If user disabled master notifications, block
      if (!userPref.receiveNotifications) {
        return false;
      }

      if (notificationType === "PROMO") {
        return userPref.notifyMarketing;
      }

      return true;
    };

    // User A: Opted out of all notifications
    const userA = { receiveNotifications: false, notifyEmail: false, notifyMarketing: false };
    expect(shouldDispatch(userA, "INFO")).toBe(false);
    expect(shouldDispatch(userA, "PROMO")).toBe(false);
    expect(shouldDispatch(userA, "ALERT")).toBe(true); // Critical alert allowed
    expect(shouldDispatch(userA, "SYSTEM")).toBe(true); // System alert allowed

    // User B: Opted in to notifications, but marketing off
    const userB = { receiveNotifications: true, notifyEmail: true, notifyMarketing: false };
    expect(shouldDispatch(userB, "INFO")).toBe(true);
    expect(shouldDispatch(userB, "PROMO")).toBe(false);
    expect(shouldDispatch(userB, "ALERT")).toBe(true);

    // User C: Opted in to everything
    const userC = { receiveNotifications: true, notifyEmail: true, notifyMarketing: true };
    expect(shouldDispatch(userC, "INFO")).toBe(true);
    expect(shouldDispatch(userC, "PROMO")).toBe(true);
  });

  it("calculates unread indicator display format correctly", () => {
    const formatBadge = (unreadCount: number): string | null => {
      if (unreadCount <= 0) return null;
      if (unreadCount > 9) return "9+";
      return unreadCount.toString();
    };

    expect(formatBadge(0)).toBe(null);
    expect(formatBadge(1)).toBe("1");
    expect(formatBadge(5)).toBe("5");
    expect(formatBadge(9)).toBe("9");
    expect(formatBadge(10)).toBe("9+");
    expect(formatBadge(99)).toBe("9+");
  });

  it("validates signup payload with notification preference checkbox", () => {
    const parseSignupPayload = (body: { name: string; email: string; receiveNotifications?: boolean }) => {
      return {
        name: body.name.trim(),
        email: body.email.toLowerCase().trim(),
        receiveNotifications: body.receiveNotifications ?? true,
      };
    };

    const payloadOptedIn = parseSignupPayload({
      name: "Somsak",
      email: "SOMSAK@TEST.COM",
      receiveNotifications: true,
    });
    expect(payloadOptedIn.receiveNotifications).toBe(true);
    expect(payloadOptedIn.email).toBe("somsak@test.com");

    const payloadOptedOut = parseSignupPayload({
      name: "Somsak",
      email: "somsak@test.com",
      receiveNotifications: false,
    });
    expect(payloadOptedOut.receiveNotifications).toBe(false);

    const payloadDefault = parseSignupPayload({
      name: "Somsak",
      email: "somsak@test.com",
    });
    expect(payloadDefault.receiveNotifications).toBe(true);
  });

  it("generates branded HTML email templates correctly", async () => {
    const {
      getWelcomeEmailHtml,
      getPasswordChangedEmailHtml,
      getTestEmailHtml,
      getAnalysisReadyEmailHtml,
    } = await import("@/lib/email/templates");

    const welcomeHtml = getWelcomeEmailHtml("Alexander");
    expect(welcomeHtml).toContain("NAMENOLOGY");
    expect(welcomeHtml).toContain("Alexander");
    expect(welcomeHtml).toContain("Welcome aboard");

    const securityHtml = getPasswordChangedEmailHtml("Alexander");
    expect(securityHtml).toContain("Security Alert");
    expect(securityHtml).toContain("password was recently changed");

    const testHtml = getTestEmailHtml("Alexander", "alex@example.com");
    expect(testHtml).toContain("alex@example.com");
    expect(testHtml).toContain("Email System Test");

    const analysisHtml = getAnalysisReadyEmailHtml("Alexander", "Nattapong", 92, "http://localhost:3000/report/1");
    expect(analysisHtml).toContain("Nattapong");
    expect(analysisHtml).toContain("92");
    expect(analysisHtml).toContain("Overall Auspicious Score");
  });
});

