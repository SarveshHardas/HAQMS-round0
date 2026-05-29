# HAQMS Engineering Evaluation Assignment Report

## Candidate Information

**Name:** Sarvesh Hardas

**Email:** hardassarvesh58@gmail.com

**GitHub Repository:**
https://github.com/SarveshHardas/HAQMS-round0

**Frontend Deployment:**
https://haqms-round0.vercel.app

**Backend Deployment:**
https://haqms-round0.onrender.com

**Video Demonstration:**
[\[Add Video Link\]](https://drive.google.com/file/d/1CK92RdmnBe2-HOe68AjYkMH1NFmbZP5m/view?usp=sharing)

**Resume:**
[\[Add Resume Link\]](https://drive.google.com/file/d/1ot08By5TNaHWRWrt2o3DRAp_nP3Ag7Q9/view?usp=sharing)

---

# Executive Summary

This assignment involved auditing, debugging, securing, optimizing, and deploying a full-stack Hospital Appointment & Queue Management System (HAQMS).

The application was intentionally designed with numerous security vulnerabilities, performance bottlenecks, architectural issues, concurrency problems, and incomplete production practices.

The primary objective was to identify, prioritize, and resolve the highest-impact issues while improving overall application security, maintainability, scalability, and production readiness.

The project was analyzed and improved across three major layers:

* Backend API
* Frontend Application
* Database Layer

The final solution has been fully deployed and tested in a production environment.

---

# Project Overview

### Original System Characteristics

The original application contained:

* SQL Injection vulnerabilities
* Weak authorization controls
* JWT security issues
* Queue race conditions
* N+1 database query problems
* Missing validation layers
* Missing database constraints
* Missing database indexes
* In-memory pagination
* Hardcoded configuration values
* Large monolithic frontend components
* Theme inconsistencies
* Production deployment issues

---

# Work Completed

## Backend Improvements

Major backend improvements included:

### Security

* SQL Injection mitigation
* JWT security hardening
* Environment-based secret management
* Role-Based Access Control (RBAC)
* Request validation using Zod
* Secure CORS implementation
* Helmet security headers
* Rate limiting

### Performance

* N+1 query optimization
* Promise.all parallelization
* Database-level pagination
* Reporting query optimization

### Database

* Unique constraints
* Index optimization
* Transactional queue operations
* Queue state validation

### Reliability

* Queue token race condition resolution
* Appointment booking integrity
* Improved error handling
* Consistent API responses

Detailed implementation notes are available in:

```txt
backend/BACKEND_REPORT.md
```

---

## Frontend Improvements

Major frontend improvements included:

### Architecture

* Dashboard refactoring
* Component decomposition
* Reusable UI modules
* Improved separation of concerns

### Authentication

* AuthContext optimization
* Authentication state improvements
* Logout crash prevention
* Environment variable migration

### User Experience

* Global theme system
* Light/Dark mode support
* Theme persistence
* Theme toggle component
* Improved responsive design

### Reliability

* Queue monitoring improvements
* Safer async handling
* Loading state fixes
* Runtime crash prevention

### Production Readiness

* Removal of assessment-only UI content
* Production-friendly error pages
* Deployment configuration improvements

Detailed implementation notes are available in:

```txt
frontend/FRONTEND_REPORT.md
```

---

# Deployment Architecture

## Frontend

**Platform:** Vercel

**URL:**

https://haqms-round0.vercel.app

---

## Backend

**Platform:** Render

**URL:**

https://haqms-round0.onrender.com

---

## Database

**Platform:** Neon PostgreSQL

---

# Key Issues Resolved

| Category    | Issue                        | Severity | Status |
| ----------- | ---------------------------- | -------- | ------ |
| Security    | SQL Injection                | Critical | Fixed  |
| Security    | Weak Authorization           | Critical | Fixed  |
| Security    | JWT Expiration Bypass        | High     | Fixed  |
| Security    | Hardcoded Secrets            | High     | Fixed  |
| Security    | Missing Validation           | High     | Fixed  |
| Performance | N+1 Queries                  | High     | Fixed  |
| Performance | In-Memory Pagination         | Medium   | Fixed  |
| Performance | Sequential Reporting Queries | High     | Fixed  |
| Concurrency | Queue Race Condition         | Critical | Fixed  |
| Database    | Missing Constraints          | High     | Fixed  |
| Database    | Missing Indexes              | Medium   | Fixed  |
| Frontend    | Hardcoded API URL            | High     | Fixed  |
| Frontend    | Dashboard Monolith           | Medium   | Fixed  |
| Frontend    | Theme Inconsistency          | Medium   | Fixed  |
| Frontend    | Queue Refresh Issues         | Medium   | Fixed  |
| Frontend    | Runtime Crashes              | High     | Fixed  |

---

# Engineering Decisions

## Security First Approach

Security vulnerabilities were prioritized before UI enhancements.

Examples:

* SQL Injection
* Authorization flaws
* JWT validation issues

These issues represented the highest risk to application integrity and user data.

---

## Database-Level Integrity

Business rules were enforced at the database layer wherever possible.

Examples:

* Unique constraints
* Transactional operations
* Indexed fields

This ensures data integrity even when application logic fails.

---

## Maintainability Over Quick Fixes

Large frontend components were refactored into reusable modules rather than applying temporary patches.

Benefits:

* Improved readability
* Easier maintenance
* Better scalability

---

## Environment-Based Configuration

Hardcoded values were replaced with environment variables.

Benefits:

* Easier deployment
* Better portability
* Environment separation

---

## Transaction-Based Queue Processing

Queue token generation was migrated to database transactions.

Benefits:

* Eliminates race conditions
* Guarantees consistency
* Improves operational reliability

---

# Production Readiness Improvements

Completed:

* Environment variable configuration
* Production deployment
* Theme persistence
* Security middleware
* Authentication hardening
* Database optimization
* Error handling improvements
* Deployment verification
* End-to-end testing

---

# Remaining Known Issues

Although the application has been significantly improved, some enhancements remain possible.

## Authentication

Current implementation stores JWT tokens in Local Storage.

Future improvements:

* HTTP-only cookies
* Refresh token strategy

---

## Data Fetching

Frontend currently relies on manual fetch logic.

Future improvements:

* React Query
* SWR
* Request caching

---

## Reporting

Reporting endpoints can be further optimized using advanced aggregation queries for larger datasets.

---

## Monitoring & Observability

Future production deployments should include:

* Centralized logging
* Error monitoring
* Metrics collection
* Application observability

---

# Project Structure

```txt
HAQMS
├── backend
│   ├── README.md
│   └── BACKEND_REPORT.md
│
├── frontend
│   └── FRONTEND_REPORT.md
│
└── ASSIGNMENT_REPORT.md
```

---

# Deliverables

## GitHub Repository

https://github.com/SarveshHardas/HAQMS-round0

---

## Frontend Deployment

https://haqms-round0.vercel.app

---

## Backend Deployment

https://haqms-round0.onrender.com

---

## Video Demonstration

[\[Add Video Link\]](https://drive.google.com/file/d/1CK92RdmnBe2-HOe68AjYkMH1NFmbZP5m/view?usp=sharing)

---

## Resume

[\[Add Resume Link\]](https://drive.google.com/file/d/1ot08By5TNaHWRWrt2o3DRAp_nP3Ag7Q9/view?usp=sharing)

---

# Conclusion

The HAQMS application was transformed from an intentionally vulnerable and inefficient implementation into a significantly more secure, maintainable, scalable, and production-ready system.

Key achievements include:

* Critical security vulnerabilities removed
* Queue concurrency issues resolved
* Database performance improved
* Backend architecture hardened
* Frontend architecture modernized
* Theme system implemented
* Production deployment completed
* End-to-end functionality validated

This project demonstrates practical experience in full-stack debugging, security engineering, performance optimization, database design, frontend architecture, and production deployment.
