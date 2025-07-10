**Product Requirements Document (PRD)**

**Project:** Varam Strength
**Date:** July 10, 2025
**Author:** ChatGPT

---

## 1. Executive Summary

Varam Strength is a web and mobile-enabled personal-training scheduling platform that connects clients with coaches for customized training sessions. In addition to general fitness, we offer **specialized rehabilitation programs** tailored to clients with injuries—such as back pain, shoulder issues, and hip problems—delivered by certified strength-coaching professionals. The platform's core features include session booking, calendar management, coach profiles, and an admin dashboard. This PRD outlines the MVP scope, functional requirements, user stories, and an additional Blog module that enables admins to publish and manage blog posts.

## 2. Objectives & Goals

- **Streamline Booking:** Simplify client booking flow with intuitive date/time selection and automated availability checks.
- **Enhance Admin Control:** Provide a robust admin dashboard for managing coaches, sessions, and content.
- **Content Marketing:** Incorporate a Blog section to share training tips, success stories, and announcements, driving user engagement and SEO.
- **Injury Rehabilitation Focus:** Design workflows and curriculum for safe, progressive training programs targeting back, shoulder, and hip rehabilitation.
- **Scalability & Localization:** Design for future growth, mobile responsiveness, and support for multiple languages (initially English and Korean).

## 3. Target Users

- **Clients (Members):** Individuals seeking personal training sessions—can browse coaches, view availability, and book sessions.
- **Clients with Injuries:** Individuals recovering from or managing conditions (e.g., back pain, shoulder issues, hip problems) who need specialized rehabilitation programming.
- **Coaches:** Trainers offering general and rehab-focused sessions—can manage their profiles, availability, and view their bookings.
- **Admins:** Platform operators—can manage users, content (including blog posts), and system settings.

## 4. Product Scope

### 4.1 In-Scope (MVP)

- User registration & authentication (email/password, magic link).
- Client dashboard: calendar view, booking interface, session list, cancelation.
- Coach profiles: list, details (bio, specialties, ratings), including rehab certifications.
- Admin dashboard: user & booking management.
- Notification system: email confirmations for booking, cancellations.
- **Rehabilitation Program Module:**
  - Predefined program templates for back pain, shoulder rehab, hip strengthening.
  - Progress tracking metrics and session notes per program.
  - Coach-assigned rehabilitation plans and timeline views.

- **Blog Module:**
  - Public Blog listing page.
  - Individual Blog detail pages.
  - Admin Blog editor: create, edit, delete posts (rich-text support, featured image).

### 4.2 Out-of-Scope (Phase 2+)

- Payment processing & subscriptions.
- In-app video coaching.
- Third-party integrations beyond Supabase & AstroWind.
- Social sharing & comments on blog posts.

## 5. Functional Requirements

### 5.1 Authentication & Authorization

- Clients & coaches sign up/in.
- Admin role with elevated permissions.
- Magic-link and email/password flows via Supabase Auth.

### 5.2 Booking System

- Monthly calendar widget showing reserved slots and disabling fully booked dates/time slots.
- Form to select date, time, training type (general or rehab), coach, and add notes.
- Real-time availability check against Supabase `bookings` table.
- Confirmation page with booking summary (date/time, coach, program type).
- Booking management: list upcoming sessions, cancel with confirmation.

### 5.3 Coach Profiles

- List all coaches with profile cards (photo, name, specialties, rehab expertise).
- Detail page per coach: bio, available time slots, past client reviews, rehab program expertise.
- Admin edit/view coaches in dashboard.

### 5.4 Admin Dashboard

- User management: list/filter clients & coaches; change roles; deactivate accounts.
- Booking management: view all bookings; search by date, user, coach; cancel/reschedule.
- Content management:
  - **Blog Posts:** CRUD operations with fields: title, slug, published date, author (admin), rich-text body, featured image.
  - **Program Templates:** CRUD for rehab program templates (exercises, session count, notes).

### 5.5 Rehabilitation Program Module

- **Template Library:** Pre-built plans for back, shoulder, hip rehab.
- **Custom Plans:** Coaches can tailor templates and assign to clients.
- **Progress Tracking:** Record session outcomes, pain scales, and milestones.
- **Timeline View:** Visual roadmap of program duration and checkpoints.

### 5.6 Blog Module

#### 5.6.1 Public Listing

- `GET /blog`: paginated list of published posts with title, excerpt, featured image, and date.

#### 5.6.2 Post Detail

- `GET /blog/:slug`: full content render.
- SEO metadata (title tag, description, OpenGraph tags).

#### 5.6.3 Admin Blog Editor

- **Create:** Form with rich-text WYSIWYG editor, image uploader, preview before publish.
- **Edit/Delete:** List of existing posts with edit and delete actions.
- **Draft & Publish:** Toggle between draft and published states.

## 6. User Stories

| Role    | As a…                         | I want to…                                          | So that…                                  |
| ------- | ----------------------------- | --------------------------------------------------- | ----------------------------------------- |
| Client  | Member                        | view my calendar with reserved slots                | I can choose an available training time   |
| Client  | Member                        | book a session with a coach directly from calendar  | booking is quick and intuitive            |
| Client  | Injured Member                | select a rehab program for back, shoulder, or hip   | I can follow a safe, guided recovery path |
| Coach   | Coach                         | update my availability                              | clients can only book when I’m free       |
| Coach   | Rehab Specialist/Physio Coach | create and assign injury-specific program templates | clients get targeted rehabilitation plans |
| Admin   | Platform Admin                | manage all user accounts                            | I can grant/revoke coach privileges       |
| Admin   | Platform Admin                | create and publish blog posts                       | I can share news and training tips        |
| Visitor | Unauthenticated visitor       | browse blog posts                                   | I can learn more before signing up        |

## 7. Non-Functional Requirements

- **Performance:** Calendar and booking operations under 200 ms.
- **Scalability:** Support up to 10,000 users and 100 concurrent booking transactions.
- **Security:** Role-based access control; IP logging for security audits.
- **Accessibility:** WCAG 2.1 AA compliance for all pages.
- **Localization:** Support language switch (English/Korean).

## 8. Technical Architecture

- **Frontend:** AstroWind (React, Tailwind CSS) for web; Flutter for mobile extension.
- **Backend:** Supabase (Auth, PostgreSQL, Edge Functions for warm-ups).
- **Hosting:** Vercel for frontend; Supabase Edge Functions.
- **Notifications:** SendGrid or Supabase Email Extensions.

## 9. Milestones & Timeline

1. **Week 1–2:** Authentication, user roles, basic dashboard scaffolding.
2. **Week 3–4:** Booking calendar component & booking flows.
3. **Week 5:** Coach profiles and admin user management.
4. **Week 6:** Rehabilitation Program Module and Blog module.
5. **Week 7:** Localization & SEO enhancements.
6. **Week 8:** Testing, performance tuning, and launch.

## 10. Risks & Mitigations

- **High traffic spikes:** Use Supabase Edge Functions warm-up cron jobs to reduce cold starts.
- **Content abuse in blog:** Implement admin-only publishing and moderate images/uploads.
- **Rehab program liability:** Include liability waivers and coach certifications; apply medical disclaimers.
- **Time-zone handling:** Store all times in UTC; display in user’s locale.

---

_End of PRD_
