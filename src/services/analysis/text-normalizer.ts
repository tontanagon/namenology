// =============================================================================
// TEXT NORMALIZATION SERVICE
// Handles Unicode NFC normalization, whitespace trimming, and language detection
// =============================================================================

import { Language } from "@prisma/client";

export interface NormalizedResult {
  originalText: string;
  normalizedText: string;
  characters: string[];
  detectedLanguage: Language;
}

export class TextNormalizer {
  /**
   * Normalizes input text using Unicode NFC form, trims excessive whitespace,
   * decomposes into individual characters, and detects predominant language.
   */
  static normalize(text: string): NormalizedResult {
    if (!text) {
      return {
        originalText: "",
        normalizedText: "",
        characters: [],
        detectedLanguage: Language.EN,
      };
    }

    // Apply Unicode NFC normalization
    const nfc = text.normalize("NFC").trim();

    // Collapse multiple internal spaces into a single space
    const collapsed = nfc.replace(/\s+/g, " ");

    // Split into individual code points / characters (excluding spaces for scoring)
    const characters: string[] = [];
    for (const char of Array.from(collapsed)) {
      if (char !== " ") {
        characters.push(char);
      }
    }

    // Detect language: if any Thai Unicode characters (\u0E00-\u0E7F) are present, classify as TH
    const hasThai = /[\u0E00-\u0E7F]/.test(collapsed);
    const detectedLanguage = hasThai ? Language.TH : Language.EN;

    return {
      originalText: text,
      normalizedText: collapsed,
      characters,
      detectedLanguage,
    };
  }

  /**
   * Validates that text meets length and character requirements.
   */
  static validate(
    text: string,
    options?: { minLength?: number; maxLength?: number }
  ): { valid: boolean; error?: string } {
    const min = options?.minLength ?? 1;
    const max = options?.maxLength ?? 100;

    const trimmed = text ? text.trim() : "";
    if (trimmed.length < min) {
      return {
        valid: false,
        error: `Input must be at least ${min} character(s) long.`,
      };
    }

    if (trimmed.length > max) {
      return {
        valid: false,
        error: `Input must not exceed ${max} characters.`,
      };
    }

    return { valid: true };
  }
}
