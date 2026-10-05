# 🚀 Kubernetes Deployment Guide for Namenology (Next.js 16)

คู่มือสำหรับการนำระบบ Namenology ขึ้นรันบน Kubernetes (K8s / K3s) พร้อมเชื่อมต่อโดเมนจาก GoDaddy

---

## 📁 โครงสร้างไฟล์ในโฟลเดอร์ `k8s/`

* `configmap.yaml` : ค่า Configuration ทั่วไป (เช่น `PORT`, `NODE_ENV`, `NEXT_PUBLIC_APP_URL`)
* `secret.yaml.example` : ไฟล์แม่แบบสำหรับเก็บความลับ (เช่น `DATABASE_URL`, Stripe Keys, SMTP)
* `deployment.yaml` : ตัวควบคุม Pod ของ Next.js 15 (มี Health Checks, Non-root security, Rolling Updates)
* `service.yaml` : Service แบบ ClusterIP สำหรับรับ Request ภายในคลัสเตอร์
* `ingress.yaml` : Ingress สำหรับชี้โดเมนและขอใบรับรอง SSL (Let's Encrypt) อัตโนมัติ
* `migration-job.yaml` : Kubernetes Job สำหรับสั่งรัน `prisma migrate deploy` อัตโนมัติ
* `postgres.yaml` : *(ทางเลือก)* สำหรับติดตั้ง PostgreSQL 16 ภายในคลัสเตอร์พร้อม Persistent Storage (PVC)

---

## 🛠️ ขั้นตอนการ Deploy

### 1. Build & Push Docker Image
สร้าง Docker Image จากโปรเจกต์ แล้วส่งไปยัง Container Registry (เช่น Docker Hub หรือ GitHub Container Registry):

```bash
# 1. Build image
docker build -t your-registry/namenology-web:latest .

# 2. Push ไปยัง Registry
docker push your-registry/namenology-web:latest
```

> **หมายเหตุ:** อย่าลืมเปลี่ยนชื่อ image ใน [deployment.yaml](file:///d:/My_doc/name/k8s/deployment.yaml) และ [migration-job.yaml](file:///d:/My_doc/name/k8s/migration-job.yaml) ให้ตรงกับ Registry ของคุณ

---

### 2. เตรียมไฟล์ Secret
คัดลอกไฟล์แม่แบบและใส่ค่าจริง:

```bash
cp k8s/secret.yaml.example k8s/secret.yaml
```
แก้ไขค่า `DATABASE_URL`, `STRIPE_SECRET_KEY`, `ADMIN_PASSWORD` ฯลฯ ใน `k8s/secret.yaml` จากนั้นสั่งสร้าง Secret:

```bash
kubectl apply -f k8s/secret.yaml
```

---

### 3. (ทางเลือก) ติดตั้ง PostgreSQL ภายในคลัสเตอร์
หากไม่ได้ใช้ Cloud Database ภายนอก (เช่น Supabase หรือ Neon) สามารถสั่งรัน PostgreSQL บน K8s ได้:

```bash
kubectl apply -f k8s/postgres.yaml
```

---

### 4. สั่งรัน Database Migration Job
รันคำสั่งเพื่อให้ Prisma อัปเดต Schema ในฐานข้อมูล:

```bash
kubectl apply -f k8s/migration-job.yaml
```

---

### 5. Deploy ตัวเว็บ Next.js 15
สั่ง Deploy ทรัพยากรทั้งหมดด้วย Kustomize:

```bash
kubectl apply -k ./k8s
```

ตรวจสอบสถานะ:
```bash
kubectl get pods -l app=namenology-web
kubectl get ingress namenology-ingress
```

---

### 6. ชี้โดเมนจาก GoDaddy มายังเซิร์ฟเวอร์
1. ดู Public IP ของ Ingress Controller หรือโหนดเซิร์ฟเวอร์:
   ```bash
   kubectl get ingress namenology-ingress
   ```
2. เข้าหน้าจัดการ **GoDaddy DNS Management**:
   - เพิ่ม **A Record**: `@` ➡️ `IP_ของ_เซิร์ฟเวอร์`
   - เพิ่ม **CNAME**: `www` ➡️ `@`
