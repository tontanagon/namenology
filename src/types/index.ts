// Common TypeScript definitions for Namenology

export type Role = "USER" | "ADMIN";

export type AnalysisType = "FIRST_NAME" | "SURNAME" | "COMBINED";

export type CreditType = "FIRST_NAME" | "SURNAME" | "COMBINED";

export type ProductType = "ANALYSIS_PACKAGE" | "SERVICE" | "SUBSCRIPTION";

export type ServiceOrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "FORM_SUBMITTED"
  | "IN_REVIEW"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export interface UserSession {
  userId: string;
  email: string;
  role: Role;
}

export interface AnalysisScoreBreakdown {
  character: string;
  score: number;
}

export interface AnalysisResultResponse {
  id: string;
  analysisType: AnalysisType;
  input: string;
  normalizedText: string;
  characterBreakdown: AnalysisScoreBreakdown[];
  rawTotal: number;
  finalScore: number;
  interpretation: {
    category: string;
    title: string;
    description: string;
    recommendation: string;
  };
  calculationVersion: string;
  createdAt: string;
}
