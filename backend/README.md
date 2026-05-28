# HAQMS Backend - Secure Hospital Appointment & Queue Management API

Backend API server for the **Hospital Appointment & Queue Management System (HAQMS)** built using:

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL
* JWT Authentication

This project was intentionally designed with multiple architectural, security, scalability, and database bugs which were later identified, analyzed, and fixed.

---

# Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* JWT Authentication
* Zod Validation
* Helmet
* Express Rate Limiter

---

# Features

* JWT Authentication & Authorization
* Role-Based Access Control (RBAC)
* Doctor Management
* Patient Management
* Appointment Booking
* Queue Management
* Reporting & Analytics
* Pagination
* Validation Middleware
* Secure API Architecture

---

# Project Setup

## Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create `.env` file inside backend root:

```env
DATABASE_URL=your_postgresql_connection_url
JWT_SECRET=your_jwt_secret
JWT_SECRET_EXPIRY=1d
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

---

# Database Setup

## Generate Prisma Client

```bash
npx prisma generate
```

## Run Migrations

```bash
npx prisma migrate dev --name init
```

## Seed Database

```bash
node prisma/seed.js
```

---

# Run Development Server

```bash
npm run dev
```

Server runs on:

```txt
http://localhost:5000
```

---

# Major Bugs Identified & Fixed

---

# 1. SQL Injection Vulnerability

## Vulnerable Code

```js
conditions.push(`name ILIKE '%${search}%'`);
```

## Problem

Raw query string interpolation allowed attackers to inject malicious SQL queries into the database.

This could expose:

* user credentials
* database tables
* sensitive hospital records

---

## Fixed Code

```js
const doctors = await prisma.doctor.findMany({
  where: {
    name: {
      contains: search,
      mode: 'insensitive',
    },
  },
});
```

## Solution

Replaced unsafe raw SQL queries with Prisma ORM query builder which automatically parameterizes queries and prevents SQL injection.

---

# 2. N+1 Database Query Problem

## Vulnerable Code

```js
for (const app of appointments) {
  const patient = await prisma.patient.findUnique(...)
  const doctor = await prisma.doctor.findUnique(...)
}
```

## Problem

For every appointment, additional database queries were executed.

This caused:

* poor scalability
* increased database load
* slow API responses

---

## Fixed Code

```js
const appointments = await prisma.appointment.findMany({
  include: {
    patient: true,
    doctor: true,
  },
});
```

## Solution

Used Prisma relational loading with `include` to fetch related entities in a single optimized query.

---

# 3. Queue Token Race Condition

## Vulnerable Code

```js
const currentMax = maxTokenResult._max.tokenNumber || 0;
const nextTokenNumber = currentMax + 1;
```

## Problem

Multiple concurrent requests could generate duplicate queue token numbers.

This caused:

* inconsistent queue ordering
* duplicate patient tokens
* operational failures

---

## Fixed Code

```js
const newToken = await prisma.$transaction(async (tx) => {
  ...
});
```

## Solution

Implemented transactional token generation using Prisma transactions along with unique database constraints.

---

# 4. Weak Authorization Middleware

## Vulnerable Code

```js
const authorizeAdminOnlyLegacy = (req, res, next) => {
  next();
};
```

## Problem

Admin verification logic was bypassed.

Any authenticated user could:

* delete patients
* access restricted operations
* manipulate sensitive data

---

## Fixed Code

```js
authorize('ADMIN')
```

## Solution

Implemented strict Role-Based Access Control (RBAC) using secure authorization middleware.

---

# 5. Weak JWT Verification

## Vulnerable Code

```js
jwt.verify(token, JWT_SECRET, {
  ignoreExpiration: true,
});
```

## Problem

Expired JWT tokens remained valid.

This created:

* session hijacking risks
* unauthorized access
* weak authentication security

---

## Fixed Code

```js
const decoded = jwt.verify(token, JWT_SECRET);
```

## Solution

Removed `ignoreExpiration` and enforced proper JWT expiration validation.

---

# 6. Hardcoded JWT Secret

## Vulnerable Code

```js
const JWT_SECRET =
  process.env.JWT_SECRET ||
  'my-super-secret-secret-key';
```

## Problem

Fallback secrets are insecure and predictable.

Attackers can forge authentication tokens.

---

## Fixed Code

```js
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing');
}
```

## Solution

Enforced environment-based secret configuration with mandatory validation.

---

# 7. Missing Pagination

## Vulnerable Code

```js
const allPatients = await prisma.patient.findMany();
```

## Problem

Entire database records were loaded into memory before filtering and pagination.

This caused:

* excessive memory usage
* poor scalability
* slower API performance

---

## Fixed Code

```js
const patients = await prisma.patient.findMany({
  skip,
  take: limit,
});
```

## Solution

Implemented database-level pagination using Prisma `skip` and `take`.

---

# 8. Missing Validation Layer

## Vulnerable Code

```js
if (!name || !phoneNumber)
```

## Problem

Only basic presence checks existed.

Invalid data could enter the database:

* invalid UUIDs
* weak phone numbers
* malformed payloads

---

## Fixed Code

```js
const validated =
  patientCreateSchema.safeParse(req.body);
```

## Solution

Implemented centralized schema validation using Zod.

---

# 9. Missing Security Middleware

## Vulnerable Code

```js
app.use(cors());
```

## Problem

Backend lacked:

* security headers
* request throttling
* controlled CORS configuration

---

## Fixed Code

```js
app.use(helmet());

app.use(rateLimiter);

app.use(cors({
  origin: [process.env.FRONTEND_URL],
}));
```

## Solution

Added:

* Helmet
* Rate Limiting
* Secure CORS policies

---

# 10. Missing Database Constraints

## Vulnerable Schema

```prisma
model Appointment {
  doctorId String
  appointmentDate DateTime
}
```

## Problem

Doctors could be double-booked at the same appointment slot.

---

## Fixed Schema

```prisma
@@unique([doctorId, appointmentDate])
```

## Solution

Added composite unique constraint to prevent duplicate appointment bookings.

---

# 11. Missing Database Indexes

## Problem

Several frequently queried columns lacked indexes.

This caused:

* slow filtering
* inefficient scans
* degraded reporting performance

---

## Fixed Schema

```prisma
@@index([doctorId, status])
@@index([patientId])
@@index([department])
```

## Solution

Added optimized indexes for frequently accessed fields.

---

# Security Improvements

* JWT Authentication
* RBAC Authorization
* Secure Error Handling
* Prisma ORM Query Safety
* Input Validation
* Helmet Security Headers
* Rate Limiting
* Protected Routes
* UUID Validation

---

# Performance Improvements

* Database-Level Pagination
* Promise.all Parallelization
* N+1 Query Optimization
* Indexed Queries
* Reduced DB Round Trips
* Optimized Reporting Queries

---

# API Routes

## Authentication

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

---

## Doctors

```txt
GET    /api/doctors
GET    /api/doctors/stats
GET    /api/doctors/:id
```

---

## Patients

```txt
GET    /api/patients
GET    /api/patients/:id
POST   /api/patients
DELETE /api/patients/:id
```

---

## Appointments

```txt
GET    /api/appointments
POST   /api/appointments
PATCH  /api/appointments/:id
```

---

## Queue

```txt
GET    /api/queue
POST   /api/queue/checkin
PATCH  /api/queue/:id
```

---

## Reports

```txt
GET    /api/reports/doctor-stats
```

---

# Learning Outcomes

This project involved identifying and fixing:

* SQL Injection
* Race Conditions
* N+1 Query Problems
* Weak Authorization
* JWT Security Issues
* Database Optimization Problems
* API Validation Gaps
* Scalability Bottlenecks

The backend was refactored toward a more production-grade architecture with improved:

* security
* maintainability
* scalability
* database performance
* workflow integrity

---