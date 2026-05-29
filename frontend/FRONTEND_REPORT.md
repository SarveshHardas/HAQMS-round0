# HAQMS Frontend Engineering Report

## Candidate Information

**Name:** Sarvesh Hardas

**Project:** Hospital Appointment & Queue Management System (HAQMS)

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Context API

---

# Project Overview

The HAQMS frontend was intentionally designed with several architectural issues, maintainability concerns, performance bottlenecks, state management problems, deployment issues, and incomplete production practices.

The objective was to identify, prioritize, and resolve these issues while improving usability, maintainability, scalability, and overall production readiness.

The frontend was reviewed page-by-page and component-by-component to identify weaknesses and implement production-grade improvements.

---

# Issues Identified

| Category         | Issue                                      | Severity | Status |
| ---------------- | ------------------------------------------ | -------- | ------ |
| Architecture     | Monolithic Dashboard Component             | High     | Fixed  |
| Architecture     | Excessive Component Responsibility         | Medium   | Fixed  |
| Architecture     | Repeated UI Logic                          | Medium   | Fixed  |
| State Management | Context Re-render Issues                   | Medium   | Fixed  |
| State Management | Unsafe User Access Patterns                | High     | Fixed  |
| State Management | Logout Crash Conditions                    | High     | Fixed  |
| Configuration    | Hardcoded API URL                          | High     | Fixed  |
| Configuration    | Deployment Environment Issues              | High     | Fixed  |
| UI/UX            | Inconsistent Theme Handling                | Medium   | Fixed  |
| UI/UX            | Missing Theme Toggle                       | Medium   | Fixed  |
| UI/UX            | Assessment Artifacts Visible in Production | Medium   | Fixed  |
| Performance      | Unnecessary Context Updates                | Medium   | Fixed  |
| Performance      | Large Dashboard Render Tree                | Medium   | Fixed  |
| Reliability      | Queue Refresh Issues                       | Medium   | Fixed  |
| Reliability      | Loading State Handling Issues              | Medium   | Fixed  |
| Reliability      | Race Conditions During Navigation          | Medium   | Fixed  |

---

# Fixes Implemented

## 1. Hardcoded API Configuration Removal

### Issue

The frontend contained hardcoded API endpoints:

```js id="mim83s"
http://localhost:5000/api
```

This prevented deployment to production environments.

### Fix

Migrated API configuration to environment variables.

```env id="7k4n06"
NEXT_PUBLIC_API_URL=
```

### Result

* Deployment-friendly configuration
* Environment separation
* Improved maintainability

---

## 2. AuthContext Optimization

### Issue

The authentication context caused unnecessary re-renders across the application.

### Fix

Implemented memoized context values using React's `useMemo`.

### Result

* Reduced unnecessary renders
* Improved performance
* Better state management

---

## 3. Authentication State Improvements

### Issue

Authentication state could become inconsistent during login/logout operations.

### Fix

Introduced explicit authentication checks and safer state transitions.

Example:

```js id="2llh8q"
const isAuthenticated =
  !!token && !!user;
```

### Result

* Improved reliability
* Cleaner authentication logic
* Better route protection

---

## 4. Dashboard Component Refactoring

### Issue

The dashboard page contained over one thousand lines of code and multiple unrelated responsibilities.

### Fix

Extracted reusable feature components.

Created:

```txt id="z6rx8z"
components/admin/
components/doctor/
components/receptionist/
components/common/
```

### Result

* Improved maintainability
* Better separation of concerns
* Easier future development

---

# Component Extraction

The following dashboard sections were separated into reusable components:

### Admin

```txt id="8hkrr9"
PhysicianRegistry.jsx
ReportsPanel.jsx
```

### Doctor

```txt id="lgu8wb"
DoctorAppointments.jsx
DoctorQueue.jsx
```

### Receptionist

```txt id="k2wfd5"
PatientRegistry.jsx
BookingPanel.jsx
RegistrationForm.jsx
```

### Benefits

* Smaller files
* Improved readability
* Better component reuse
* Easier testing

---

## 5. Theme System Implementation

### Issue

The application lacked a centralized theme architecture.

Theme handling was inconsistent across pages.

### Fix

Implemented:

```txt id="o8u0i8"
ThemeContext
ThemeProvider
ThemeToggle Component
Persistent Theme Storage
```

### Result

* Consistent design system
* Improved accessibility
* Better user experience

---

## 6. Persistent Theme Preferences

### Issue

Theme selection was not preserved across sessions.

### Fix

Implemented:

```txt id="agxvji"
localStorage persistence
System preference detection
Automatic theme restoration
```

### Result

* Persistent user preferences
* Modern user experience

---

## 7. Light and Dark Theme Standardization

### Issue

Theme colors were inconsistent and difficult to maintain.

### Fix

Migrated styling toward reusable semantic theme variables.

Examples:

```txt id="1jlwm6"
background
foreground
card
border
primary
secondary
```

### Result

* Improved consistency
* Easier future customization
* Better visual hierarchy

---

## 8. Production UI Cleanup

### Issue

Assessment-specific instructions and development artifacts were exposed to users.

Examples included:

* Candidate challenge notes
* Deliberately vulnerable descriptions
* Development-only instructions

### Fix

Removed all non-production messaging.

### Result

* Professional user experience
* Cleaner production interface

---

## 9. 404 Page Improvements

### Issue

The Not Found page exposed internal project information.

### Fix

Replaced assessment instructions with production-friendly messaging.

### Result

* Better user experience
* Cleaner error handling

---

## 10. Queue Workflow Improvements

### Issue

Queue-related interactions occasionally produced inconsistent UI behavior.

### Fix

Improved:

* Queue refresh logic
* State synchronization
* Error handling

### Result

* More reliable workflow
* Improved user confidence

---

## 11. Loading State Management

### Issue

Loading indicators were not always reset correctly after asynchronous operations.

### Fix

Introduced safer loading state handling patterns.

### Result

* Reduced UI lockups
* Improved responsiveness

---

## 12. Navigation Safety Improvements

### Issue

Some routes could access undefined user data during navigation transitions.

### Fix

Added defensive rendering checks and authentication guards.

### Result

* Eliminated runtime crashes
* Improved application stability

---

# UI & Design Improvements

Implemented:

* Unified spacing system
* Consistent form styling
* Standardized buttons
* Consistent cards
* Better typography hierarchy
* Theme-aware components
* Improved responsiveness

---

# Performance Improvements

Implemented:

* Context optimization
* Component decomposition
* Reduced render complexity
* Improved state handling
* Smaller reusable UI modules

---

# Deployment

## Frontend

Deployed on Vercel:

https://haqms-round0.vercel.app

## Backend API

Connected to:

https://haqms-round0.onrender.com

---

# Production Readiness Improvements

Completed:

* Environment variable configuration
* Production API configuration
* Theme persistence
* Error handling cleanup
* Deployment verification
* Authentication flow validation
* CORS integration testing

---

# Remaining Known Issues

Although the frontend has been significantly improved, some enhancements remain possible.

### 1. JWT Storage Strategy

Current implementation stores JWT tokens in Local Storage.

Future improvement:

* HTTP-only secure cookies
* Refresh token architecture

### 2. Data Fetching Layer

The project currently relies on custom fetch logic.

Future improvement:

* React Query
* SWR
* Request caching

### 3. Form Abstraction

Some forms still use local component state.

Future improvement:

* React Hook Form
* Shared validation layer

### 4. Dashboard Analytics

Additional visualizations and charts could improve usability.

---

# Engineering Decisions

## Why Component Decomposition?

Large files become difficult to maintain and review.

Component extraction improves:

* readability
* scalability
* reuse

---

## Why Theme Context?

A centralized theme system provides:

* consistency
* persistence
* maintainability

---

## Why Environment Variables?

Environment variables separate deployment configuration from source code.

This improves:

* portability
* security
* deployment flexibility

---

## Why Memoized Context Values?

Memoization reduces unnecessary re-renders and improves overall application performance.

---

# Conclusion

The frontend was successfully refactored from an intentionally imperfect implementation into a significantly more maintainable, scalable, and production-ready application.

Key outcomes include:

* Dashboard architecture improvements
* Theme system implementation
* Deployment readiness
* Environment-based configuration
* Authentication improvements
* UI consistency enhancements
* Improved state management
* Better user experience

The resulting frontend architecture is considerably cleaner, more maintainable, and better aligned with modern React and Next.js development practices.
