# HAQMS Backend Engineering Report

## Candidate Information

**Name:** Sarvesh Hardas

**Project:** Hospital Appointment & Queue Management System (HAQMS)

**Tech Stack:** Node.js, Express.js, PostgreSQL, Prisma ORM, JWT Authentication

---

# Project Overview

The HAQMS backend was intentionally designed with multiple security vulnerabilities, performance bottlenecks, concurrency issues, validation gaps, and database inefficiencies.

The objective of this assignment was to identify, analyze, prioritize, and resolve critical issues while improving the overall maintainability, security, scalability, and production readiness of the system.

The backend was audited route-by-route and schema-by-schema to identify architectural weaknesses and implement production-grade fixes.

---

# Issues Identified

| Category     | Issue                         | Severity | Status |
| ------------ | ----------------------------- | -------- | ------ |
| Security     | SQL Injection Vulnerability   | Critical | Fixed  |
| Security     | Weak Authorization Middleware | Critical | Fixed  |
| Security     | JWT Expiration Bypass         | High     | Fixed  |
| Security     | Hardcoded JWT Secret Fallback | High     | Fixed  |
| Security     | Missing Request Validation    | High     | Fixed  |
| Security     | Weak CORS Configuration       | Medium   | Fixed  |
| Performance  | N+1 Database Queries          | High     | Fixed  |
| Performance  | In-Memory Pagination          | Medium   | Fixed  |
| Performance  | Sequential Reporting Queries  | High     | Fixed  |
| Concurrency  | Queue Token Race Condition    | Critical | Fixed  |
| Database     | Missing Unique Constraints    | High     | Fixed  |
| Database     | Missing Indexes               | Medium   | Fixed  |
| Architecture | Inconsistent API Responses    | Medium   | Fixed  |

---

# Fixes Implemented

## 1. SQL Injection Prevention

### Issue

Doctor search functionality used raw query interpolation.

This allowed malicious input to manipulate SQL queries and potentially expose sensitive database records.

### Fix

Replaced raw SQL interpolation with Prisma ORM query builders using parameterized filtering.

### Result

* Eliminated SQL Injection risk
* Improved query safety
* Improved maintainability

---

## 2. N+1 Query Optimization

### Issue

Appointment listing executed additional database queries for every appointment record.

### Fix

Used Prisma relational loading with `include`.

### Result

* Reduced database round trips
* Improved response times
* Better scalability under larger datasets

---

## 3. Queue Token Race Condition Resolution

### Issue

Concurrent patient check-ins could generate duplicate queue token numbers.

### Fix

Implemented transactional token generation using Prisma transactions and database constraints.

### Result

* Guaranteed unique queue tokens
* Consistent queue ordering
* Improved workflow reliability

---

## 4. Role-Based Access Control (RBAC)

### Issue

Legacy authorization middleware allowed privilege escalation.

### Fix

Replaced legacy checks with role-based middleware.

Example:

```js
authorize('ADMIN')
```

### Result

* Protected administrative operations
* Prevented unauthorized access
* Improved security posture

---

## 5. JWT Security Hardening

### Issue

Expired JWT tokens were accepted because expiration validation was bypassed.

### Fix

Removed expiration bypass configuration and enforced strict JWT validation.

### Result

* Expired tokens rejected correctly
* Reduced authentication risk
* Improved session security

---

## 6. Environment-Based Secret Management

### Issue

Application contained insecure fallback JWT secrets.

### Fix

Made JWT secrets mandatory through environment variables.

### Result

* Prevented predictable token generation
* Improved production security

---

## 7. Database-Level Pagination

### Issue

Patient records were loaded entirely into memory before pagination.

### Fix

Implemented Prisma `skip` and `take` pagination.

### Result

* Reduced memory consumption
* Improved performance
* Better scalability

---

## 8. Input Validation Layer

### Issue

Endpoints relied on manual field checks.

### Fix

Implemented centralized request validation using Zod schemas.

### Result

* Consistent validation
* Cleaner route handlers
* Improved data integrity

---

## 9. Security Middleware Implementation

### Issue

Security headers and request throttling were missing.

### Fix

Added:

* Helmet
* Express Rate Limiter
* Controlled CORS Configuration

### Result

* Improved protection against common attacks
* Reduced abuse potential
* More secure production deployment

---

## 10. Reporting Module Optimization

### Issue

Doctor statistics endpoint executed multiple sequential queries.

### Fix

Parallelized database operations using Promise.all.

### Result

* Reduced report generation time
* Improved scalability
* Better user experience

---

# Database Improvements

## Unique Constraints Added

### Appointment Booking Protection

```prisma
@@unique([doctorId, appointmentDate])
```

### Benefits

* Prevents duplicate bookings
* Maintains schedule integrity
* Eliminates conflicting appointments

---

# Database Indexing Improvements

Indexes were added to frequently queried fields.

Examples:

```prisma
@@index([doctorId, status])
@@index([patientId])
@@index([department])
```

### Benefits

* Faster filtering
* Improved reporting performance
* Reduced database scan costs

---

# Security Improvements Summary

Implemented:

* JWT Authentication
* RBAC Authorization
* Zod Validation
* Helmet Security Headers
* Rate Limiting
* Secure CORS Configuration
* Database Constraints
* Query Parameterization
* Environment-Based Secret Management

---

# Performance Improvements Summary

Implemented:

* N+1 Query Optimization
* Database-Level Pagination
* Parallelized Queries
* Indexed Database Searches
* Reduced Database Round Trips
* Optimized Reporting Logic

---

# Deployment

## Backend

Deployed on Render:

https://haqms-round0.onrender.com

## Database

Hosted on Neon PostgreSQL.

---

# Remaining Known Issues

The backend is significantly more secure and scalable than the original implementation, however some areas could still be improved in future iterations:

### 1. JWT Storage Architecture

Current frontend stores JWT tokens in Local Storage.

Future improvement:

* HTTP-only secure cookies
* Refresh token strategy

### 2. Reporting Aggregation

Current reporting is optimized but could further leverage database aggregation functions for very large datasets.

### 3. API Documentation

The project currently lacks formal OpenAPI / Swagger documentation.

### 4. Centralized Logging

Structured logging systems such as Winston or Pino could improve production observability.

---

# Engineering Decisions

## Why Prisma ORM?

Prisma provides:

* Type safety
* Query parameterization
* Easier maintainability
* Reduced SQL Injection risk

## Why Transactions for Queue Generation?

Queue generation is a concurrency-sensitive operation.

Transactions guarantee consistency and prevent duplicate token creation.

## Why Zod?

Zod provides:

* Declarative validation
* Reusable schemas
* Consistent error handling

## Why Database Constraints?

Business rules should be enforced at the database layer to guarantee data integrity even if application logic fails.

---

# Conclusion

The backend was successfully refactored from an intentionally vulnerable and inefficient implementation into a significantly more secure, maintainable, and scalable system.

Key outcomes include:

* Critical security vulnerabilities removed
* Queue concurrency issues resolved
* Database performance improved
* Validation layer introduced
* Authorization system hardened
* Production deployment completed

The resulting backend architecture is substantially closer to production-grade standards and demonstrates secure API design, database optimization, and scalable backend engineering practices.
