// =============================================================================
// NOTIFICATION SERVICE
// Handles creating, querying, and managing in-app notifications
// =============================================================================

import { prisma } from "@/lib/prisma";

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type?: "INFO" | "SUCCESS" | "ALERT" | "PROMO" | "SYSTEM";
  link?: string;
}

export class NotificationService {
  /**
   * Retrieves notifications for a given user ordered by creation time.
   */
  async getUserNotifications(userId: string, limit = 20) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Returns count of unread notifications for a user.
   */
  async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  /**
   * Marks a single notification as read if it belongs to the user.
   */
  async markAsRead(userId: string, notificationId: string) {
    return prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  /**
   * Marks all notifications as read for a user.
   */
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  /**
   * Creates a notification for a user, respecting user's receiveNotifications master toggle.
   */
  async createNotification(data: CreateNotificationInput) {
    // Check if user has opted into notifications
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: { receiveNotifications: true },
    });

    // If user turned off notifications completely and type is not critical SYSTEM alert, skip
    if (user && !user.receiveNotifications && data.type !== "SYSTEM" && data.type !== "ALERT") {
      return null;
    }

    return prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || "INFO",
        link: data.link,
      },
    });
  }

  /**
   * Deletes a notification belonging to a user.
   */
  async deleteNotification(userId: string, notificationId: string) {
    return prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });
  }
}

export const notificationService = new NotificationService();
