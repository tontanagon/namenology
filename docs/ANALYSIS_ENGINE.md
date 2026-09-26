# ANALYSIS ENGINE — NAMENOLOGY

Last Updated: 2026-09-22

---

## 1. Overview

The Namenology Analysis Engine calculates auspicious scores for names based on character-level numeric mappings, configurable component weights, and versioned formulas. All configuration is database-driven.

---

## 2. Architecture

```
Input (raw text)
  ↓
Unicode Normalization (NFC)
  ↓
Whitespace Trimming + Validation
  ↓
Character Decomposition
  ↓
Character Score Lookup (from character_scores table)
  ↓
Component Score Calculation (average of character scores)
  ↓
Weight Application (from name_components table)
  ↓
Missing Field Policy (REDISTRIBUTE_WEIGHT or SKIP)
  ↓
Final Weighted Score
  ↓
Score Normalization (1-100 scale)
  ↓
Interpretation Resolution (from score_interpretations table)
  ↓
Store Result with calculation_version + config snapshot
```

---

## 3. Character Scoring

### Character Score Lookup

Each character in the input is mapped to a numeric score via the `character_scores` table.

```
character_scores:
  character | language | score | is_active
  A         | EN       | 80    | true
  B         | EN       | 70    | true
  ก         | TH       | 85    | true
  ข         | TH       | 75    | true
```

- Only `is_active = true` characters are used
- Characters not found in the database produce a validation error
- Character lookup is case-insensitive for English (normalize to uppercase before lookup)

### Component Score Formula

For a given component (e.g., First Name = "ABC"):

```
Character scores: A=80, B=70, C=90
Component Score = (80 + 70 + 90) / 3 = 80.00
```

Formula: `Component Score = SUM(character_scores) / COUNT(characters)`

---

## 4. Weight System

### Weight Configuration

Weights are stored in the `name_components` table:

```
Default Configuration:
  FIRST_NAME  → weight: 60, is_enabled: true
  SURNAME     → weight: 40, is_enabled: true
  MIDDLE_NAME → weight: 0,  is_enabled: false
  NICKNAME    → weight: 0,  is_enabled: false
```

**Critical Rule:** The sum of weights for all `is_enabled = true` components MUST equal 100.00. The system rejects any configuration save that violates this.

### Weight Application

```
Final Score = Σ (Component Score × Weight / 100)

Example:
  First Name Score = 80, Weight = 60%
  Surname Score = 70, Weight = 40%
  Final Score = (80 × 0.60) + (70 × 0.40) = 48 + 28 = 76.00
```

---

## 5. Missing Optional Field Handling

When an enabled optional component (e.g., Middle Name) has no input:

### Policy A: REDISTRIBUTE_WEIGHT (Default)

Redistribute the missing component's weight proportionally to components that have input.

```
Example:
  FIRST_NAME: 50% (has input, score = 80)
  MIDDLE_NAME: 10% (enabled but no input)
  SURNAME: 30% (has input, score = 70)
  NICKNAME: 10% (enabled but no input)

  Active weight total: 50 + 30 = 80
  Redistributed:
    FIRST_NAME: 50/80 × 100 = 62.5%
    SURNAME: 30/80 × 100 = 37.5%

  Final Score = (80 × 0.625) + (70 × 0.375) = 50 + 26.25 = 76.25
```

### Policy B: SKIP

Simply ignore missing components. Only calculate with provided components using their original weights normalized to sum to 100.

---

## 6. Analysis Types

### 6.1 FIRST_NAME Analysis
- Input: Single first name string
- Scoring: Character-level scoring of the first name only
- Weight: Uses FIRST_NAME component weight (normalized to 100% since it's the only component)
- Credit: Consumes 1 FIRST_NAME credit

### 6.2 SURNAME Analysis
- Input: Single surname string
- Scoring: Character-level scoring of the surname only
- Weight: Uses SURNAME component weight (normalized to 100%)
- Credit: Consumes 1 SURNAME credit

### 6.3 COMBINED Analysis
- Input: First name + Surname (both required)
- Scoring: Character-level scoring of each component separately
- Weight: Uses configured weights for FIRST_NAME and SURNAME
- Result: Combined weighted score
- Credit: Consumes 1 COMBINED credit
- Note: Combined analysis is a SEPARATE product. It is NOT the same as running a FIRST_NAME + SURNAME analysis individually.

---

## 7. Score Normalization

The raw weighted score is already in 0-100 range due to the scoring design. However, normalization applies:

1. Floor: Minimum score is 1 (no zero scores displayed)
2. Ceiling: Maximum score is 100
3. Precision: Rounded to `score_precision` decimal places (default: 2)

```
Normalized Score = MAX(1, MIN(100, ROUND(rawScore, precision)))
```

---

## 8. Interpretation Resolution

After scoring, the system maps the final score to an interpretation from the `score_interpretations` table:

```
Score Range → Interpretation
  1-20:   Category "VERY_LOW"    — needs improvement, caution recommended
  21-40:  Category "LOW"         — moderate concerns, consider alternatives
  41-60:  Category "MODERATE"    — acceptable, room for optimization
  61-80:  Category "GOOD"        — positive alignment, favorable indicators
  81-100: Category "EXCELLENT"   — highly auspicious, strong harmonic resonance
```

Each interpretation has: `title`, `description`, `recommendation`, `language`, `is_active`

Interpretations are Admin-configurable and can support multiple languages.

---

## 9. Calculation Versioning (REQ-B24)

### Version Tracking

Every analysis stores:
- `calculation_version`: String identifier (e.g., "1.0", "1.1")
- `config_snapshot`: JSONB containing frozen state of weights, scoring rules used

### Version Incrementing

A new version is created when Admin changes:
- Character scores
- Component weights
- Scoring formula rules
- Normalization parameters

### Historical Reproducibility

Analysis #100 with `calculation_version: "1.0"` must always display the same result, even after Admin updates to version "1.1". The `config_snapshot` field ensures this.

---

## 10. Entitlement Check Before Analysis

Before executing any analysis:

```
1. Authenticate user
2. Determine analysis type (FIRST_NAME, SURNAME, COMBINED)
3. Check credit balance: SUM(amount) FROM credit_ledger WHERE user_id AND credit_type
4. If balance <= 0: Return 403 with paywall message
5. If balance > 0: Atomically reserve credit (within DB transaction)
6. Execute analysis
7. On success: Commit transaction (credit consumed)
8. On failure: Rollback transaction (credit restored)
```

---

## 11. Input Validation

| Rule | Value |
|---|---|
| Minimum input length | 1 character (configurable) |
| Maximum input length | 100 characters (configurable) |
| Allowed characters | Must exist in `character_scores` table with `is_active = true` |
| Unicode normalization | NFC form applied before validation |
| Whitespace | Leading/trailing trimmed, internal spaces handled per business rule |
