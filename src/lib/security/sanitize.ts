// =============================================================================
// INPUT SANITIZATION & ANTI-XSS ENGINE (OWASP A03 COMPLIANCE)
// Sanitizes user inputs, strips dangerous injection vectors, and normalizes Unicode
// =============================================================================

import { z } from "zod";

/**
 * Strips HTML tags, script injection patterns, and control characters.
 * Normalizes string using Unicode NFC standard.
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";

  return (
    input
      // 1. Unicode NFC normalization (crucial for Thai tones & diacritics)
      .normalize("NFC")
      // 2. Strip null bytes and non-printable control characters (except common whitespace)
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      // 3. Strip script tags and event handlers
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
      // 4. Strip inline event handlers (e.g., onload=, onerror=, onclick=)
      .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/\bon\w+\s*=\s*[^>\s]+/gi, "")
      // 5. Strip javascript: and vbscript: pseudoprotocols
      .replace(/javascript\s*:/gi, "")
      .replace(/vbscript\s*:/gi, "")
      // 6. Strip all remaining HTML tags
      .replace(/<[^>]*>/g, "")
      // 7. Trim leading/trailing whitespace
      .trim()
  );
}

/**
 * HTML entities encoder for safe rendering of untrusted strings.
 */
export function escapeHtml(input: string): string {
  if (typeof input !== "string") return "";

  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };

  return input.replace(/[&<>"'`=/]/g, (char) => htmlEscapes[char] || char);
}

/**
 * Deep recursive object sanitization for request payloads.
 */
export function sanitizeObject<T>(data: T): T {
  if (typeof data === "string") {
    return sanitizeString(data) as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeObject(item)) as unknown as T;
  }

  if (data !== null && typeof data === "object") {
    const sanitizedObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      sanitizedObj[key] = sanitizeObject(value);
    }
    return sanitizedObj as T;
  }

  return data;
}

/**
 * Zod preprocessor helper that applies sanitizeString to any string field.
 */
export const zSanitizedString = (schema = z.string()) =>
  z.preprocess((val) => (typeof val === "string" ? sanitizeString(val) : val), schema);
