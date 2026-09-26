# MASTER PROMPT

## Build a Production-Ready Name Analysis Subscription Web Application

คุณคือ Senior Full-Stack Engineer, Software Architect, UI/UX Engineer และ Security Engineer

จงสร้าง Web Application สำหรับ “วิเคราะห์การตั้งชื่อ” แบบ Production-ready โดยระบบต้องสามารถนำไปพัฒนาต่อจริงได้ มีโครงสร้างที่อ่านง่าย แยก Component ชัดเจน มีระบบ Authentication, Subscription ผ่าน Stripe, Admin Dashboard, PostgreSQL, Docker และระบบเอกสารสำหรับให้ AI ตัวอื่นเข้ามารับช่วงงานต่อได้

---

# 1. PRODUCT OVERVIEW

ระบบนี้เป็น Web Application สำหรับวิเคราะห์ชื่อบุคคล โดยผู้ใช้งานกรอกข้อมูล เช่น

* ชื่อ
* นามสกุล
* ชื่อกลาง
* ชื่อเล่น

ระบบจะคำนวณคะแนนจากตัวอักษร โดยแต่ละตัวอักษรมีคะแนนที่สามารถกำหนดได้จาก Admin Dashboard

จากนั้นนำคะแนนของแต่ละส่วนมาคำนวณเป็นเปอร์เซ็นต์ตาม Weight ที่ Admin กำหนด

ตัวอย่าง:

* ชื่อ = 60%
* นามสกุล = 40%

หรือ

* ชื่อ = 50%
* ชื่อกลาง = 10%
* นามสกุล = 30%
* ชื่อเล่น = 10%

Admin ต้องสามารถเปลี่ยน Weight ได้โดยไม่ต้องแก้ Source Code

---

# 2. TECHNOLOGY STACK

ใช้ Stack ที่เหมาะกับ Production และ Maintenance ระยะยาว

## Frontend / Full Stack

* Next.js
* App Router
* TypeScript
* Tailwind CSS
* Component-based architecture
* Server Components เมื่อเหมาะสม
* Client Components เฉพาะส่วนที่จำเป็น
* API ผ่าน Next.js Route Handlers หรือ Server Actions ตามความเหมาะสม

## UI

* Responsive Design
* Desktop / Tablet / Mobile
* Modern SaaS Dashboard style
* ใช้ Component ที่ reusable
* ใช้ SVG/Icon library หรือ icon placeholder
* ห้ามใช้ Emoji

ตัวอย่าง icon ที่สามารถใช้แทน Emoji:

* User icon
* Lock icon
* Search icon
* Settings icon
* Credit Card icon
* Shield icon
* Chart icon
* Dashboard icon
* Logout icon

หากยังไม่มี icon asset ให้เขียนเป็น placeholder เช่น:

`[USER_ICON]`

`[SETTINGS_ICON]`

หรือใช้ SVG ที่เรียบง่าย

## Database

* PostgreSQL
* Prisma ORM
* Database Migration
* Seed Data

## Authentication

ใช้ระบบ Authentication ที่เหมาะกับ Next.js และรองรับ

* Signup
* Signin
* Signout
* Session Management
* Password Hashing
* Email uniqueness
* Protected Route
* Role-based Authorization

รองรับ Role:

* USER
* ADMIN

อย่าให้ Client สามารถกำหนด Role เองได้

## Payment

* Stripe
* Stripe Checkout
* Stripe Customer
* Stripe Subscription
* Stripe Webhook
* Stripe Customer Portal

ต้องตรวจสอบ Subscription จาก Server เท่านั้น

ห้ามเชื่อค่าจาก Client สำหรับสถานะ Subscription

## Infrastructure

ใช้ Docker

ต้องมีอย่างน้อย:

* Frontend / Application Container
* PostgreSQL Container

สร้าง:

* `Dockerfile`
* `docker-compose.yml`
* `.dockerignore`
* `.env.example`

ใช้ Multi-stage Docker Build

Application Container ควรทำงานด้วย User ที่ไม่ใช่ root เมื่อเหมาะสม

---

# 3. CORE BUSINESS LOGIC

## 3.1 Character Scoring

แต่ละตัวอักษรต้องมีคะแนน

ตัวอย่าง:

A = 10
B = 20
C = 15

สำหรับภาษาไทยสามารถกำหนดคะแนนแยกเป็นตัวอักษรได้ เช่น

ก = 10
ข = 20
ค = 15

Database ต้องรองรับทั้งภาษาไทยและภาษาอังกฤษด้วย Unicode

Admin ต้องสามารถ:

* เพิ่มตัวอักษร
* แก้คะแนน
* ลบตัวอักษร
* เปิด/ปิดการใช้งาน
* ค้นหาตัวอักษร
* Filter ตามภาษา
* Filter ตามสถานะ

ห้าม hard-code คะแนนไว้ใน frontend

---

# 4. NAME ANALYSIS ALGORITHM

ออกแบบระบบให้สามารถแก้ไขสูตรภายหลังได้ง่าย

## 4.1 Component Score

คำนวณคะแนนของแต่ละส่วนของชื่อ เช่น

* First Name
* Middle Name
* Last Name
* Nickname

แนวทาง Default:

1. แยกตัวอักษรของข้อความ
2. Normalize Unicode
3. ตัด space ที่ไม่จำเป็น
4. ตรวจสอบตัวอักษรที่รองรับ
5. ดึงคะแนนของแต่ละตัวอักษรจาก Database
6. คำนวณคะแนนของ Component

ตัวอย่าง:

ชื่อ:

`ABC`

คะแนน:

A = 80
B = 70
C = 90

Component Score:

`(80 + 70 + 90) / 3 = 80`

---

# 5. WEIGHT SYSTEM

ระบบต้องรองรับ Weight ที่ Config ได้

Default:

First Name = 60%

Last Name = 40%

แต่ Admin สามารถเปลี่ยนได้ เช่น

First Name = 50%

Middle Name = 10%

Last Name = 30%

Nickname = 10%

ผลรวม Weight ของ Active Components ต้องเท่ากับ 100%

ระบบต้อง Validate ก่อนบันทึก

ห้ามปล่อย Configuration ที่ Weight รวมไม่เท่ากับ 100%

---

# 6. OPTIONAL NAME COMPONENTS

รองรับ Component เพิ่มเติมจากหลังบ้าน

Default Components:

* First Name
* Last Name

สามารถเปิดใช้:

* Middle Name
* Nickname

ในอนาคตสามารถเพิ่ม Component ใหม่ได้โดยไม่ต้องแก้ Core Algorithm เช่น

* English Name
* Family Name
* Chinese Name
* Custom Name

ดังนั้นควรออกแบบ Database ให้ใช้ Configuration-driven architecture

ไม่ควรเขียนแบบ:

```ts
if (firstName) {}
if (lastName) {}
```

เต็มระบบแบบ hard-coded

ควรออกแบบเป็น Dynamic Component Configuration

ตัวอย่าง Concept:

```text
name_components
- id
- key
- label
- description
- is_required
- is_enabled
- weight
- sort_order
```

---

# 7. MISSING OPTIONAL FIELD HANDLING

ถ้า Middle Name หรือ Nickname ไม่ได้กรอก

ระบบต้องมี Policy ที่ Config ได้

ตัวอย่าง Policy:

### Policy A

ไม่คิดคะแนนส่วนที่ว่าง และ Redistribute Weight ไปยังส่วนที่มีข้อมูล

### Policy B

ไม่คิดคะแนนส่วนที่ว่าง และไม่ Redistribute

ควรสร้าง Setting สำหรับกำหนด behavior

Default:

`REDISTRIBUTE_WEIGHT`

---

# 8. FINAL SCORE

ตัวอย่าง:

First Name Score = 80
Weight = 60%

Last Name Score = 70
Weight = 40%

Final Score:

`80 × 0.60 + 70 × 0.40 = 76`

แสดงผลเป็น:

`76%`

ต้องรองรับคะแนนทศนิยมตาม Configuration

---

# 9. FREE USAGE LIMIT

ผู้ใช้งานใหม่สามารถวิเคราะห์ชื่อฟรีจำนวน:

`2 ครั้ง`

Default Rule:

* 2 ครั้งต่อ Account
* นับจาก Analysis ที่สำเร็จ
* Analysis ที่ Validation Error ไม่ควรถูกหัก
* Analysis ที่ Server Error ไม่ควรถูกหัก

หลังจากใช้ครบ 2 ครั้ง:

ต้องแสดง Subscription Paywall

ตัวอย่าง:

```text
คุณใช้สิทธิ์วิเคราะห์ฟรีครบแล้ว

สมัครสมาชิกเพื่อวิเคราะห์ชื่อเพิ่มเติม
[View Plans]
```

จำนวน Free Usage ต้องสามารถแก้จาก Admin Dashboard ได้

ตัวอย่าง:

`free_analysis_limit = 2`

ห้าม hard-code เป็น `2` ใน Source Code

---

# 10. USAGE TRACKING

สร้างระบบเก็บประวัติการใช้งาน

อย่างน้อยควรมี:

* user_id
* analysis_id
* created_at
* status
* source
* calculation_version

ไม่ควรเก็บข้อมูลชื่อดิบเกินกว่าที่จำเป็น

ระบบควรออกแบบ Data Retention ได้

---

# 11. SUBSCRIPTION SYSTEM

ใช้ Stripe

Flow:

```text
User
  ↓
เลือก Subscription
  ↓
Create Stripe Checkout Session
  ↓
Stripe Checkout
  ↓
Payment Success
  ↓
Stripe Webhook
  ↓
Update Subscription in Database
  ↓
User ได้สิทธิ์ใช้งาน
```

---

# 12. STRIPE REQUIREMENTS

รองรับ:

* Stripe Customer
* Stripe Checkout
* Subscription
* Webhook
* Customer Portal
* Subscription Status
* Renewal
* Cancellation
* Payment Failed

อย่างน้อยต้องรองรับสถานะ:

* trialing
* active
* past_due
* canceled
* unpaid
* incomplete

ต้องเก็บ Stripe IDs ใน Database เช่น:

* stripe_customer_id
* stripe_subscription_id
* stripe_price_id

ห้ามถือว่า Redirect จาก Stripe = Payment Success

สิทธิ์ Subscription ต้องอัปเดตจาก Stripe Webhook ที่ตรวจสอบ Signature แล้วเท่านั้น

---

# 13. STRIPE WEBHOOK SECURITY

Webhook endpoint ต้อง:

* ตรวจสอบ Stripe Signature
* ใช้ Raw Request Body ตามข้อกำหนดของ Stripe
* Reject Request ที่ Signature ไม่ถูกต้อง
* รองรับ Idempotency
* ป้องกัน Event ถูกประมวลผลซ้ำ

สร้างตาราง:

`stripe_webhook_events`

อย่างน้อย:

```text
id
stripe_event_id
event_type
processed
processed_at
created_at
```

หาก Event ถูกประมวลผลไปแล้ว ห้าม process ซ้ำ

---

# 14. AUTHENTICATION

สร้างหน้าหลัก:

* `/signin`
* `/signup`
* `/forgot-password`
* `/reset-password`
* `/account`

Signup:

* Name
* Email
* Password
* Confirm Password

Validation:

* Email format
* Email uniqueness
* Password strength
* Password confirmation
* Input length

Signin:

* Email
* Password

ต้องป้องกัน Brute Force / Credential Stuffing

ระบบต้องมี Rate Limiting

---

# 15. PASSWORD SECURITY

ห้ามเก็บ Password แบบ Plain Text

ต้องใช้ Password Hashing Algorithm ที่เหมาะสม เช่น:

* Argon2id

จัดการ Session ด้วย Secure Cookie

Cookie ต้องพิจารณา:

* HttpOnly
* Secure
* SameSite

ตาม Deployment Environment

---

# 16. ADMIN DASHBOARD

สร้าง:

`/admin`

และต้องป้องกันด้วย Server-side Authorization

เฉพาะ USER ที่มี Role = ADMIN เท่านั้น

ห้ามตรวจ Role ด้วย frontend อย่างเดียว

---

# 17. ADMIN DASHBOARD FEATURES

Dashboard ต้องมี:

## Overview

แสดง:

* Total Users
* Active Subscriptions
* Free Analyses Used
* Paid Analyses
* Revenue Summary
* Recent Activity

## Character Score Management

Admin สามารถ:

* Create
* Read
* Update
* Delete
* Enable / Disable
* Search
* Filter
* Pagination

## Name Component Management

สามารถ:

* เพิ่ม Component
* ลบ Component
* เปิด / ปิด Component
* กำหนด Weight
* กำหนด Label
* กำหนด Required / Optional
* กำหนด Sort Order

## Analysis Configuration

ตัวอย่าง:

```text
Free Analysis Limit
Score Decimal Places
Missing Field Policy
Minimum Name Length
Maximum Name Length
Allowed Characters
```

## Subscription Configuration

ควรเก็บข้อมูล Config เช่น:

* Stripe Price ID
* Plan Name
* Display Name
* Description
* Price
* Currency
* Billing Interval
* Active / Inactive

อย่างไรก็ตาม ราคาที่เรียกเก็บจริงต้องอ้างอิง Stripe Price ID ที่ฝั่ง Server

## User Management

Admin สามารถ:

* ดู User
* Search User
* Filter User
* ดู Subscription Status
* ดู Usage
* Disable User ตาม Business Rule
* เปลี่ยน Role เฉพาะ Admin ที่ได้รับอนุญาต

ทุก Administrative Action ที่สำคัญควรมี Audit Log

---

# 18. AUDIT LOG

สร้างระบบ:

`admin_audit_logs`

เก็บ:

* admin_user_id
* action
* target_type
* target_id
* metadata
* ip_address ตามกฎหมาย/ข้อกำหนดที่เกี่ยวข้อง
* user_agent ตามความจำเป็น
* created_at

ห้ามเก็บ Password, Secret Key หรือข้อมูล sensitive ใน Audit Log

---

# 19. USER DASHBOARD

หน้า:

`/dashboard`

แสดง:

* จำนวนครั้งที่ใช้ไป
* จำนวนครั้งฟรีที่เหลือ
* Subscription Status
* Current Plan
* Recent Analyses
* Button วิเคราะห์ชื่อใหม่
* Manage Subscription

ถ้าไม่มี Subscription และใช้ Free Limit หมดแล้ว

ให้เข้าสู่ Paywall

---

# 20. ANALYSIS PAGE

หน้า:

`/analyze`

ประกอบด้วย Dynamic Form

ตัวอย่าง:

```text
First Name
[________________]

Middle Name
[________________]

Last Name
[________________]

Nickname
[________________]

[Analyze]
```

Fields ต้องสร้างจาก Configuration

ไม่ควร hard-code Field ในหน้า UI

---

# 21. ANALYSIS RESULT

แสดง:

* Overall Score
* Component Scores
* Weight
* Score Breakdown
* Letter Breakdown
* Calculation Summary

ตัวอย่าง:

```text
Overall Score
76%

First Name
80%
Weight: 60%

Last Name
70%
Weight: 40%
```

แสดง Visualization ที่อ่านง่าย เช่น:

* Progress Bar
* Donut Chart
* Bar Chart

ใช้ SVG หรือ Chart Library

ห้ามใช้ Emoji

---

# 22. ANALYSIS HISTORY

สร้างหน้า:

`/analysis-history`

ผู้ใช้สามารถดู:

* วันที่
* ชื่อที่วิเคราะห์แบบ Masked หรือตาม Privacy Setting
* คะแนน
* Analysis Status

และสามารถดูรายละเอียด Analysis ได้

---

# 23. PRIVACY

ระบบนี้จัดการข้อมูลชื่อบุคคล จึงต้องคำนึงถึง Privacy

ออกแบบให้สามารถ:

* ลบ Analysis History
* ลบบัญชี
* ลบข้อมูลที่เกี่ยวข้อง
* ไม่ log raw name โดยไม่จำเป็น
* ไม่ส่งข้อมูลชื่อไปยัง External API ที่ไม่จำเป็น
* จำกัดสิทธิ์การเข้าถึงข้อมูล

สร้าง Privacy Policy และ Terms placeholder

---

# 24. DATABASE DESIGN

ออกแบบ Database ให้ Normalize และขยายระบบได้

อย่างน้อยควรพิจารณาตาราง:

```text
users
sessions
accounts

roles
user_roles

name_components
character_scores

analysis_configs
analyses
analysis_components
analysis_character_details

subscriptions
subscription_events

stripe_webhook_events

admin_audit_logs

system_settings
```

สามารถปรับ Schema ตาม Architecture ที่เหมาะสม

ต้องมี:

* Primary Key
* Foreign Key
* Unique Constraint
* Index
* Created At
* Updated At
* Soft Delete ตามความเหมาะสม

ต้องสร้าง Prisma Schema และ Migration

---

# 25. IMPORTANT DATABASE RULES

อย่าเก็บ Configuration เป็น JSON ทั้งหมดถ้ามีข้อมูลที่ต้อง Query/Filter/Sort บ่อย

ควรแยกข้อมูลที่ต้องบริหารจัดการเป็น Table

กำหนด Index สำหรับ:

* user email
* user id
* stripe customer id
* stripe subscription id
* analysis user id
* created_at
* character score lookup

---

# 26. API ARCHITECTURE

ออกแบบ API ให้ชัดเจน

ตัวอย่าง:

```text
POST   /api/auth/signup
POST   /api/auth/signin

GET    /api/me
GET    /api/me/usage
GET    /api/me/subscription

POST   /api/analysis
GET    /api/analysis/history
GET    /api/analysis/:id

POST   /api/stripe/checkout
POST   /api/stripe/portal
POST   /api/stripe/webhook

GET    /api/admin/users
GET    /api/admin/characters
POST   /api/admin/characters
PATCH  /api/admin/characters/:id
DELETE /api/admin/characters/:id

GET    /api/admin/components
POST   /api/admin/components
PATCH  /api/admin/components/:id

GET    /api/admin/settings
PATCH  /api/admin/settings
```

สามารถปรับรูปแบบ Endpoint ตาม Architecture ที่เหมาะสม

ทุก Protected Endpoint ต้องมี Authorization

---

# 27. SECURITY REQUIREMENTS

ต้องตรวจสอบระบบตามแนวทาง OWASP

อย่างน้อยต้องตรวจ:

## Authentication Security

* Password hashing
* Session protection
* Brute force protection
* Rate limit
* Account enumeration protection
* Secure cookies
* Session expiration
* Logout invalidation

## Input Security

* Server-side validation
* Schema validation
* Maximum input length
* Unicode normalization
* Sanitization ตามความจำเป็น

## Injection Protection

* SQL Injection
* XSS
* Command Injection
* Header Injection

ใช้ Prisma / parameterized queries

ห้ามต่อ SQL String แบบ unsafe

## Authorization

ตรวจสิทธิ์ทุก Server Action / Route Handler

ห้ามพึ่ง:

```ts
if (isAdmin) {
   showAdminPage()
}
```

เพียงฝั่ง Client

Server ต้องตรวจซ้ำ

## CSRF

ใช้ Protection ที่เหมาะกับ Authentication Architecture

## SSRF

หากระบบมีการรับ URL จาก User ต้อง validate และ restrict destination

## Open Redirect

ตรวจสอบ redirect target

## File Upload

ถ้ามีในอนาคต:

* MIME validation
* File size limit
* Extension validation
* Virus scanning ตามความเหมาะสม
* Storage isolation

## Stripe

* Verify webhook signature
* Server-side entitlement
* Idempotency
* Never expose secret key
* Never trust payment status from browser

## Secrets

ห้าม commit:

* Stripe Secret Key
* Auth Secret
* Database Password
* API Keys

สร้าง:

`.env.example`

แต่ห้ามใส่ Secret จริง

---

# 28. SECURITY HEADERS

ตั้งค่า Security Headers ที่เหมาะสม เช่น:

* Content-Security-Policy
* X-Content-Type-Options
* Referrer-Policy
* Strict-Transport-Security ใน Production
* Permissions-Policy
* Frame protection / CSP frame-ancestors

ต้องระวัง CSP ไม่ให้ทำให้ระบบ Stripe หรือ Authentication เสีย

---

# 29. RATE LIMITING

ต้องมี Rate Limiting อย่างน้อยสำหรับ:

* Signup
* Signin
* Password Reset
* Analysis
* Stripe Checkout Creation
* Admin APIs

ออกแบบ Rate Limiter ให้เปลี่ยน Storage ได้ง่าย

เช่น:

```text
RateLimiter Interface
       ↓
Postgres Implementation
       ↓
สามารถเปลี่ยนเป็น Redis ในอนาคตได้
```

---

# 30. ERROR HANDLING

ห้ามแสดง Error ภายใน เช่น:

```text
Prisma error
Database connection string
Stack trace
Stripe secret information
```

แก่ User

Frontend ต้องได้รับข้อความที่เหมาะสม

Backend ต้อง Log รายละเอียดสำหรับ Developer

สร้าง Error Handling Layer ที่เป็นมาตรฐาน

---

# 31. LOGGING

สร้าง Structured Logging

แบ่ง:

* INFO
* WARN
* ERROR
* SECURITY

ห้าม Log:

* Password
* Token
* Session Secret
* Stripe Secret
* Full payment information
* Raw personal data ที่ไม่จำเป็น

---

# 32. UI / UX

ออกแบบให้เป็น SaaS Web Application ที่ดู Professional

หน้า Landing Page:

* Hero
* Feature
* How It Works
* Pricing
* FAQ
* CTA
* Footer

หน้าระบบ:

* Dashboard Layout
* Sidebar
* Header
* User Menu
* Responsive Navigation

Admin:

* Sidebar
* Data Table
* Search
* Filter
* Pagination
* Modal / Drawer
* Form
* Validation
* Toast / Alert

ไม่ใช้ Emoji

ใช้:

* SVG
* Icon Library
* Icon Placeholder

ทุก UI Component ต้องแยกเป็น Reusable Component

---

# 33. COMPONENT ARCHITECTURE

หลีกเลี่ยงไฟล์ Component ใหญ่เกินไป

ตัวอย่าง:

```text
components/
  ui/
  layout/
  auth/
  dashboard/
  analysis/
  subscription/
  admin/
  charts/
  forms/
```

ตัวอย่าง:

```text
components/analysis/
  AnalysisForm.tsx
  AnalysisResult.tsx
  ScoreBreakdown.tsx
  CharacterBreakdown.tsx
  WeightSummary.tsx
  AnalysisHistory.tsx
```

Admin:

```text
components/admin/
  AdminSidebar.tsx
  CharacterScoreTable.tsx
  CharacterScoreForm.tsx
  NameComponentTable.tsx
  NameComponentForm.tsx
  SystemSettingsForm.tsx
  UserTable.tsx
  SubscriptionTable.tsx
  AuditLogTable.tsx
```

แยก Business Logic ออกจาก UI

ห้ามใส่ Calculation Logic จำนวนมากไว้ใน React Component

---

# 34. SERVICE LAYER

สร้าง Service Layer

ตัวอย่าง:

```text
lib/
  auth/
  analysis/
  stripe/
  subscription/
  users/
  admin/
  security/
```

ตัวอย่าง:

```text
analysis/
  analysis.service.ts
  scoring.service.ts
  weight.service.ts
  analysis.repository.ts
```

---

# 35. VALIDATION

ใช้ Schema Validation เช่น Zod หรือ Library ที่เหมาะสม

ต้อง Validate ทั้ง:

* Client
* Server

แต่ Server Validation เป็น Source of Truth

---

# 36. TESTING

ต้องมี Test

## Unit Tests

ทดสอบ:

* Character scoring
* Name scoring
* Weight calculation
* Missing optional field
* Free usage limit
* Subscription entitlement

## Integration Tests

ทดสอบ:

* Signup
* Signin
* Analysis
* Database transaction
* Stripe webhook

## E2E Tests

อย่างน้อย:

```text
Signup
↓
Login
↓
Analyze 1
↓
Analyze 2
↓
Attempt Analyze 3
↓
Paywall
↓
Stripe Subscription
↓
Subscription Active
↓
Analyze Again
```

---

# 37. TRANSACTION SAFETY

การหัก Free Analysis Usage และสร้าง Analysis Record ควรทำใน Database Transaction เดียวกันเมื่อเหมาะสม

ต้องป้องกัน Race Condition

กรณี User เปิด Browser หลาย Tab แล้วกด Analyze พร้อมกัน

ต้องไม่ทำให้ Free Limit ถูก bypass

---

# 38. SUBSCRIPTION ENTITLEMENT

สร้าง Server-side function เช่น:

```ts
canAnalyzeUser(userId)
```

ผลลัพธ์ต้องพิจารณา:

```text
Free Usage Remaining
OR
Active Subscription
```

ห้ามตรวจสอบเฉพาะ Frontend

ตัวอย่าง:

```text
Client
   ↓
POST /api/analysis
   ↓
Authenticate
   ↓
Check Authorization
   ↓
Check Free Usage / Subscription
   ↓
Validate Input
   ↓
Run Analysis
   ↓
Save Result
   ↓
Return Result
```

---

# 39. CONFIGURATION-DRIVEN ARCHITECTURE

Business Rule ที่อาจเปลี่ยนในอนาคตต้องไม่ Hard-code

ตัวอย่าง:

```text
FREE_ANALYSIS_LIMIT
DEFAULT_NAME_WEIGHT
DEFAULT_SURNAME_WEIGHT
SCORE_PRECISION
MISSING_COMPONENT_POLICY
MAX_NAME_LENGTH
SUPPORTED_CHARACTERS
```

ควรเก็บใน Database หรือ Configuration Layer

Admin สามารถแก้ได้โดยไม่ต้อง Deploy ใหม่ในกรณีที่เหมาะสม

---

# 40. VERSIONING OF ANALYSIS FORMULA

สำคัญมาก

เมื่อ Admin เปลี่ยนคะแนนหรือ Formula ในอนาคต

Analysis เก่าต้องไม่เปลี่ยนผลย้อนหลังโดยอัตโนมัติ

ดังนั้น Analysis ต้องเก็บ:

```text
calculation_version
formula_version
```

หรือ Snapshot ของ Configuration ที่จำเป็น

ตัวอย่าง:

```text
Analysis #100
Formula Version: 1.2
```

แม้ Admin เปลี่ยนสูตรเป็น Version 1.3

Analysis #100 ต้องยังสามารถแสดงผลเดิมได้

---

# 41. DOCKER

สร้าง Docker Environment สำหรับ Development

ตัวอย่าง:

```yaml
services:
  app:
    build:
      context: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: ...
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres
    environment:
      POSTGRES_DB: ...
      POSTGRES_USER: ...
      POSTGRES_PASSWORD: ...
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

ต้องมี:

* Healthcheck
* Persistent PostgreSQL Volume
* Environment Variables
* Migration Command
* Seed Command

อย่าใส่ Secret จริงใน docker-compose

---

# 42. DATABASE SEED

สร้าง Seed Data สำหรับ Development

เช่น:

## Default Components

```text
First Name
Last Name
Middle Name
Nickname
```

โดย Default:

```text
First Name = enabled
Last Name = enabled
Middle Name = disabled
Nickname = disabled
```

## Default Weight

```text
First Name = 60
Last Name = 40
```

## Default Settings

```text
Free Analysis Limit = 2
Score Precision = 2
Missing Field Policy = REDISTRIBUTE_WEIGHT
```

## Test Character Scores

สร้างตัวอย่างคะแนนภาษาไทยและภาษาอังกฤษ

---

# 43. ADMIN INITIAL USER

ต้องมีวิธีสร้าง Admin อย่างปลอดภัย

เช่น:

```bash
npm run db:create-admin
```

หรือ Seed ผ่าน Environment Variables

ห้าม hard-code Admin Password ใน Source Code

---

# 44. ENVIRONMENT VARIABLES

สร้าง `.env.example`

เช่น:

```env
DATABASE_URL=

AUTH_SECRET=

NEXT_PUBLIC_APP_URL=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

STRIPE_PRICE_ID=

NODE_ENV=
```

ห้ามใส่ค่าจริง

แยก:

* Development
* Test
* Production

---

# 45. SEO

Landing Page ต้องรองรับ:

* Metadata
* Open Graph
* Robots
* Sitemap
* Canonical URL

Protected dashboard ไม่ควร index

---

# 46. ACCESSIBILITY

รองรับ:

* Semantic HTML
* Keyboard Navigation
* Focus State
* Form Label
* Error Message
* aria-label ตามความเหมาะสม
* Color Contrast
* Screen Reader

ไม่ใช้ Icon อย่างเดียวโดยไม่มี accessible meaning

---

# 47. PERFORMANCE

คำนึงถึง:

* Server Components
* Dynamic Import เมื่อเหมาะสม
* Image Optimization
* Database Index
* Pagination
* Avoid N+1 query
* Caching สำหรับ Configuration ที่ปลอดภัยต่อการ Cache
* Minimize unnecessary client JavaScript

---

# 48. SECURITY AUDIT

ก่อนถือว่า Project เสร็จ ต้องทำ Security Review

ตรวจอย่างน้อย:

```text
[ ] Authentication
[ ] Authorization
[ ] Session Security
[ ] Password Hashing
[ ] Rate Limiting
[ ] Input Validation
[ ] SQL Injection
[ ] XSS
[ ] CSRF
[ ] SSRF
[ ] Open Redirect
[ ] Security Headers
[ ] Secret Exposure
[ ] Stripe Webhook Security
[ ] Stripe Entitlement Security
[ ] Admin Access
[ ] Audit Logging
[ ] Docker Security
[ ] Dependency Vulnerabilities
[ ] Sensitive Data Logging
```

สร้างเอกสาร:

`docs/SECURITY.md`

โดยระบุ:

* Threat Model
* Security Controls
* Known Risks
* Mitigations
* Security Checklist
* Future Improvements

---

# 49. SECURITY TOOLING

เตรียม Script สำหรับตรวจสอบ เช่น:

```bash
npm audit
```

และ Tool ที่เหมาะสมสำหรับ:

* Dependency scanning
* Secret scanning
* Static analysis
* Security linting
* OWASP-oriented testing

สามารถเพิ่ม OWASP ZAP ใน Development / CI ได้ตามความเหมาะสม

---

# 50. DOCUMENTATION FOR MULTIPLE AI AGENTS

นี่เป็น Requirement สำคัญ

Project ต้องออกแบบให้ AI หลายตัวสามารถรับช่วงงานต่อกันได้

สร้าง Folder:

```text
docs/
```

ประกอบด้วย:

```text
docs/
  AI_CONTEXT.md
  PRD.md
  ARCHITECTURE.md
  DATABASE.md
  API.md
  AUTH.md
  STRIPE.md
  ANALYSIS_ENGINE.md
  SECURITY.md
  TESTING.md
  DEPLOYMENT.md
  ADMIN_GUIDE.md
  DECISIONS.md
  TODO.md
  CHANGELOG.md
```

---

# 51. AI_CONTEXT.md

ไฟล์นี้สำคัญที่สุดสำหรับ AI ตัวถัดไป

ต้องระบุ:

```text
Project Overview
Tech Stack
Current Architecture
Folder Structure
Database Structure
Important Business Rules
Authentication Flow
Stripe Flow
Analysis Algorithm
Security Rules
Current Features
Incomplete Features
Known Bugs
Current TODO
Development Commands
Environment Variables
Important Decisions
```

AI ตัวอื่นต้องสามารถอ่านไฟล์นี้แล้วเข้าใจ Project ได้ทันที

---

# 52. TODO.md

แบ่งสถานะ:

```text
## TODO
- [ ] ...

## IN PROGRESS
- [ ] ...

## DONE
- [x] ...

## BLOCKED
- [ ] ...
```

ทุกครั้งที่ AI ทำงานเสร็จ ให้ Update TODO

---

# 53. CHANGELOG.md

ทุก Feature สำคัญให้บันทึก:

```text
Date
Feature
Changed
Reason
Files
Database Changes
Breaking Changes
Migration Required
```

---

# 54. DECISIONS.md

บันทึก Architecture Decision เช่น:

```text
Decision
Context
Options
Chosen Approach
Reason
Trade-offs
```

เพื่อป้องกัน AI ตัวถัดไปแก้ระบบย้อนกลับโดยไม่รู้เหตุผล

---

# 55. CHECKLISTS

สร้าง:

```text
checklists/
  DEVELOPMENT_CHECKLIST.md
  SECURITY_CHECKLIST.md
  RELEASE_CHECKLIST.md
  STRIPE_CHECKLIST.md
  DATABASE_CHECKLIST.md
  AI_HANDOFF_CHECKLIST.md
```

---

# 56. AI WORKFLOW

ก่อนเขียน Code ให้ AI ทำตามขั้นตอนนี้:

## Step 1 — Analyze

อ่าน:

```text
docs/AI_CONTEXT.md
docs/PRD.md
docs/ARCHITECTURE.md
docs/TODO.md
```

## Step 2 — Plan

ก่อนเปลี่ยน Code ให้ระบุ:

* Files ที่ต้องเปลี่ยน
* Database ที่ต้องเปลี่ยน
* API ที่ต้องเปลี่ยน
* Dependencies ที่เพิ่ม
* Security Impact

## Step 3 — Implement

เขียน Code ตาม Architecture

## Step 4 — Test

Run:

```text
Lint
Typecheck
Unit Tests
Integration Tests
E2E Tests
Build
```

## Step 5 — Security Review

ตรวจ Security Impact

## Step 6 — Documentation

Update:

```text
AI_CONTEXT.md
TODO.md
CHANGELOG.md
DECISIONS.md
```

ตามความเหมาะสม

---

# 57. IMPORTANT AI CODING RULES

ห้าม:

* เขียน Component ใหญ่โดยไม่จำเป็น
* Duplicate Business Logic
* Hard-code Business Rules
* Hard-code Character Scores
* Hard-code Subscription Status
* Trust Client-side Authorization
* Trust Client-side Payment Success
* Commit Secrets
* Log Sensitive Data
* ใช้ Emoji ใน UI
* สร้างไฟล์ใหญ่เกินความจำเป็น
* แก้ Database โดยไม่สร้าง Migration
* เปลี่ยน Architecture โดยไม่บันทึกใน DECISIONS.md

ต้อง:

* ใช้ TypeScript แบบ Strict
* Reusable Components
* Server-side Validation
* Server-side Authorization
* Database Transaction เมื่อจำเป็น
* Error Handling
* Loading State
* Empty State
* Error State
* Accessible UI
* Responsive UI

---

# 58. PROJECT FOLDER STRUCTURE

เสนอ Architecture ประมาณนี้:

```text
src/
  app/
    (public)/
      page.tsx
      pricing/
    (auth)/
      signin/
      signup/
      forgot-password/
      reset-password/
    (dashboard)/
      dashboard/
      analyze/
      analysis-history/
      subscription/
      account/
    admin/
      dashboard/
      users/
      characters/
      components/
      subscriptions/
      settings/
      audit-logs/
    api/
      auth/
      analysis/
      stripe/
      admin/

  components/
    ui/
    layout/
    auth/
    dashboard/
    analysis/
    subscription/
    admin/
    charts/

  lib/
    auth/
    analysis/
    stripe/
    subscription/
    security/
    validation/
    db/

  services/
    analysis/
    users/
    subscription/
    admin/

  repositories/
    analysis/
    users/
    subscription/
    admin/

  types/

prisma/
  schema.prisma
  seed.ts
  migrations/

docs/
checklists/
public/
```

สามารถปรับ Folder Structure ได้ หากมีเหตุผลทาง Architecture แต่ต้องบันทึกไว้ใน `docs/DECISIONS.md`

---

# 59. USER FLOW

## Guest

```text
Landing Page
   ↓
ดูรายละเอียดระบบ
   ↓
ดู Pricing
   ↓
Sign Up
```

## Free User

```text
Signup
   ↓
Dashboard
   ↓
Analyze
   ↓
Analysis #1
   ↓
Analysis #2
   ↓
Analysis Limit Reached
   ↓
Subscription Page
```

## Paid User

```text
Login
   ↓
Dashboard
   ↓
Analyze
   ↓
Unlimited / Plan-based Analysis
```

## Subscription

```text
Pricing
   ↓
Choose Plan
   ↓
Stripe Checkout
   ↓
Payment
   ↓
Webhook
   ↓
Update Subscription
   ↓
User Access
```

## Admin

```text
Admin Login
   ↓
Admin Dashboard
   ↓
Configure Character Scores
   ↓
Configure Name Components
   ↓
Configure Weights
   ↓
Configure Free Analysis Limit
   ↓
Manage Users
   ↓
View Subscription
   ↓
View Audit Logs
```

---

# 60. ADMIN CONFIGURATION EXAMPLE

หน้า:

`/admin/settings`

ควรมี Sections:

### Analysis Settings

```text
Free Analysis Limit
[ 2 ]

Score Decimal Places
[ 2 ]

Missing Component Policy
[ Redistribute Weight ]

Minimum Input Length
[ 1 ]

Maximum Input Length
[ 100 ]
```

### Name Components

```text
First Name
Enabled
Weight: 60%

Last Name
Enabled
Weight: 40%

Middle Name
Disabled

Nickname
Disabled
```

Admin สามารถ Add New Component

---

# 61. CHARACTER SCORE ADMIN PAGE

ตัวอย่าง Table:

```text
Character | Language | Score | Status | Updated At | Actions
-------------------------------------------------------------
ก         | TH       | 80    | Active | ...        | Edit
ข         | TH       | 70    | Active | ...        | Edit
A         | EN       | 60    | Active | ...        | Edit
B         | EN       | 75    | Active | ...        | Edit
```

รองรับ:

* Search
* Filter
* Sort
* Pagination
* Bulk update ตามความเหมาะสม

---

# 62. SUBSCRIPTION PAGE

สร้าง Pricing UI

ตัวอย่าง:

```text
FREE
2 Analyses
No Subscription

PRO
Unlimited Analysis
Analysis History
Priority Features

[Subscribe]
```

ราคาและข้อมูลต้องมาจาก Configuration / Stripe Price

ห้าม hard-code pricing logic ใน frontend

---

# 63. ACCOUNT PAGE

แสดง:

```text
Profile
Email
Role

Subscription
Plan
Status
Renewal Date

Usage
Free Analyses Used
Free Analyses Remaining

[Manage Subscription]
[Delete Account]
```

---

# 64. SUCCESS CRITERIA

Project ถือว่าเสร็จเมื่อ:

### Authentication

* Signup ทำงาน
* Signin ทำงาน
* Signout ทำงาน
* Protected Routes ทำงาน
* Admin Route ปลอดภัย

### Analysis

* วิเคราะห์ชื่อได้
* Character Score มาจาก Database
* Weight มาจาก Database
* รองรับ First Name
* รองรับ Last Name
* รองรับ Middle Name
* รองรับ Nickname
* Optional Component ทำงาน
* Final Score ถูกต้อง
* Formula Version ถูกบันทึก

### Free Limit

* Free User ได้ 2 ครั้งตาม Default Config
* ใช้งานครบแล้วถูก Block
* Race Condition ไม่สามารถ bypass ได้

### Stripe

* Checkout ทำงาน
* Webhook ทำงาน
* Subscription Status Sync
* Customer Portal ทำงาน
* Entitlement ตรวจจาก Server

### Admin

* Character Management
* Component Management
* Weight Management
* System Settings
* User Management
* Subscription Monitoring
* Audit Logs

### Security

* No Secret Leak
* Password Hashing
* Rate Limit
* Input Validation
* Authorization
* Webhook Signature Verification
* Security Headers
* Safe Logging
* Dependency Audit

### Docker

```bash
docker compose up -d
```

ต้องสามารถเปิดระบบได้

### Documentation

AI ตัวถัดไปต้องสามารถอ่าน:

```text
docs/AI_CONTEXT.md
docs/ARCHITECTURE.md
docs/DATABASE.md
docs/API.md
docs/SECURITY.md
docs/TODO.md
```

แล้วสามารถทำงานต่อได้โดยไม่ต้องเดา Architecture

---

# 65. REQUIRED DELIVERABLES

เมื่อสร้าง Project ให้ส่งมอบ:

1. Complete Source Code
2. PostgreSQL Schema
3. Prisma Migration
4. Prisma Seed
5. Dockerfile
6. docker-compose.yml
7. .env.example
8. Authentication System
9. Subscription System
10. Stripe Webhook
11. Admin Dashboard
12. Name Analysis Engine
13. Unit Tests
14. Integration Tests
15. E2E Tests
16. Security Review
17. Documentation
18. AI Handoff Documentation
19. Checklists
20. Setup Guide

---

# 66. DEFINITION OF DONE

ห้ามถือว่า Feature เสร็จเพียงเพราะ UI แสดงผลได้

Feature จะถือว่าเสร็จเมื่อ:

```text
UI
↓
Validation
↓
Authorization
↓
Business Logic
↓
Database
↓
Error Handling
↓
Tests
↓
Security Review
↓
Documentation
```

ครบทั้งหมด

---

# 67. FIRST TASK FOR THE AI

อย่าเริ่มเขียน Feature ทั้งหมดทันที

ให้เริ่มตามลำดับ:

### Phase 1

สร้าง Project Architecture

### Phase 2

สร้าง Documentation:

```text
docs/PRD.md
docs/ARCHITECTURE.md
docs/DATABASE.md
docs/AI_CONTEXT.md
docs/SECURITY.md
docs/TODO.md
docs/DECISIONS.md
```

### Phase 3

ออกแบบ Database และ Prisma Schema

### Phase 4

สร้าง Authentication

### Phase 5

สร้าง Analysis Engine

### Phase 6

สร้าง Admin Configuration

### Phase 7

สร้าง Stripe Subscription

### Phase 8

สร้าง Dashboard / UI

### Phase 9

สร้าง Tests

### Phase 10

Security Audit

### Phase 11

Docker Verification

### Phase 12

Final Documentation

---

# 68. IMPORTANT FINAL INSTRUCTION

ต้องสร้างระบบในลักษณะ:

```text
Configuration Driven
Component Based
Type Safe
Server Validated
Server Authorized
Testable
Secure
Maintainable
AI Handoff Friendly
Production Ready
```

ก่อนจบงาน ให้ตรวจสอบว่าไม่มี Business Logic สำคัญถูก hard-code ใน UI

และต้องตรวจสอบว่า Admin สามารถเปลี่ยน:

```text
Character Scores
Name Components
Weights
Free Analysis Limit
Missing Component Policy
Analysis Configuration
Subscription Configuration
```

ได้โดยไม่จำเป็นต้องแก้ Source Code ในกรณีที่ Requirement ระบุว่าสามารถ Config จากหลังบ้านได้

ห้ามใช้ Emoji ใน UI, Documentation ตัวอย่าง UI หรือข้อความ Interface

ใช้ Icon / SVG / Placeholder แทน เช่น:

```text
[SETTINGS_ICON]
[USER_ICON]
[LOCK_ICON]
[CARD_ICON]
[CHART_ICON]
[SHIELD_ICON]
```

เมื่อมีสิ่งที่ต้องใช้ Asset จากภายนอกแต่ยังไม่มีไฟล์ ให้สร้าง Placeholder และระบุชนิด Icon/SVG ที่ต้องการใน Comment แทนการใส่ Emoji
