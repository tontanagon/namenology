# DEPLOYMENT — NAMENOLOGY

Last Updated: 2026-09-22

---

## 1. Docker Deployment

### Prerequisites
- Docker 24+ and Docker Compose v2
- Environment variables configured (see `.env.example`)

### Quick Start (Development)
```bash
# Clone and configure
cp .env.example .env.local
# Edit .env.local with your values

# Start services
docker compose up -d

# Run database migrations
docker compose exec app npx prisma migrate deploy

# Seed database
docker compose exec app npx prisma db seed

# Application available at http://localhost:3000
```

### Production Build
```bash
# Build and start
docker compose -f docker-compose.yml up -d --build

# Verify health
curl http://localhost:3000/api/health
```

---

## 2. Container Architecture

### App Container (namenology_app)
- Base: `node:20-alpine` (minimal footprint)
- Build: Multi-stage (deps → builder → runner)
- User: Non-root `nextjs` (uid 1001)
- Output: Next.js standalone mode
- Port: 3000

### DB Container (namenology_postgres)
- Image: `postgres:16-alpine`
- Volume: `postgres_data` (persistent)
- Healthcheck: `pg_isready` every 5s
- Port: 5432

---

## 3. Database Management Commands

```bash
# Generate Prisma client
npx prisma generate

# Create migration from schema changes
npx prisma migrate dev --name description_of_change

# Apply migrations in production
npx prisma migrate deploy

# Reset database (DEVELOPMENT ONLY)
npx prisma migrate reset --force

# Seed database
npx prisma db seed

# Open Prisma Studio (database browser)
npx prisma studio

# Create admin user
npm run db:create-admin
```

---

## 4. Environment Configuration

### Development
```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/namenology
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Use Stripe test keys
```

### Production
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:secure_password@db-host:5432/namenology_prod
NEXT_PUBLIC_APP_URL=https://your-domain.com
AUTH_SECRET=<32+ char random string>
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 5. Pre-Deployment Checklist

```
[ ] All environment variables set (no placeholders)
[ ] AUTH_SECRET is a strong random string (>= 32 chars)
[ ] Stripe keys are production keys (sk_live, not sk_test)
[ ] Database migrations applied
[ ] Database seeded with initial data
[ ] Admin user created
[ ] HTTPS configured (for Secure cookies and HSTS)
[ ] Stripe webhook endpoint registered in Stripe Dashboard
[ ] Health check endpoint responding (/api/health)
[ ] npm audit shows no critical vulnerabilities
[ ] Docker container runs as non-root user
[ ] Secrets NOT committed to version control
```

---

## 6. Monitoring

### Health Check
```
GET /api/health → { status: "ok", version: "0.1.0" }
```

### Logs
- Application logs via Docker: `docker compose logs -f app`
- Database logs: `docker compose logs -f db`
- Structured logging with severity levels (INFO, WARN, ERROR, SECURITY)

---

## 7. Scaling Considerations

- **Horizontal scaling**: Next.js standalone output supports multiple instances behind a load balancer
- **Session affinity**: Not required (sessions stored in PostgreSQL, not memory)
- **Database**: Consider read replicas for heavy read workloads
- **Rate limiting**: Migrate from PostgreSQL-backed to Redis for distributed deployments
- **Static assets**: Consider CDN for production (Vercel, CloudFront, etc.)
