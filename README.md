# 🛡️ Varam Strength - Personal Training Platform

## 🚀 Overview

**Strength for Life. Power with Purpose.**

![Varam Strength](https://github.com/juheekim1217/hts/blob/main/src/assets/images/screenshot.png)

**Varam Strength** is a comprehensive personal training platform that connects clients with certified coaches for customized training sessions. Our platform specializes in both general fitness and **specialized rehabilitation programs** for clients with injuries—such as back pain, shoulder issues, and hip problems.

Whether you're a beginner seeking guidance, an athlete recovering from injury, or someone looking to improve their overall fitness, our platform provides personalized training solutions delivered by certified strength-coaching professionals.

> "This is not just training. This is strength reimagined for everyone."

**Coming Soon:** We plan to extend Varam Strength to a cross-platform mobile app using **Flutter** for both iOS and Android, bringing all features and booking capabilities to your phone.

---

## 📋 Product Requirements Document (PRD)

Our comprehensive PRD outlines the MVP scope and future roadmap for Varam Strength's booking platform. This includes:

### 🎯 Core Features

- **User Authentication**: Email/password and magic link flows via Supabase Auth
- **Booking System**: Real-time calendar with availability checks and session booking
- **Coach Profiles**: Detailed coach listings with specialties and rehabilitation expertise
- **Admin Dashboard**: User management, booking oversight, and content management
- **Rehabilitation Programs**: Specialized training for back, shoulder, and hip injuries
- **Blog Module**: Content marketing with admin publishing capabilities

### 🧪 Testing Framework

We maintain comprehensive automated tests covering:

- **API Endpoints**: Booking validation, error handling, and email functionality
- **React Components**: User interactions, form validation, and state management
- **Business Logic**: Data validation, duplicate prevention, and error scenarios

Run tests with: `npm test`

### 🔒 Security Testing (SAST)

Comprehensive Static Application Security Testing implemented with:

- **ESLint Security Plugin**: Detects common JavaScript/TypeScript vulnerabilities
- **GitHub CodeQL**: Automated code analysis for security issues  
- **Semgrep**: Advanced pattern-based security scanning
- **Dependency Auditing**: Regular vulnerability checks for npm packages

**Automated Security Scanning:**
- **Weekly scans**: Every Monday at 2 AM UTC
- **On every push** to main/develop branches
- **On every pull request** to main
- Results available in GitHub Security tab

Run security scans with: `npm run security`

### 📊 Technical Architecture

- **Frontend**: AstroWind (React + Tailwind CSS)
- **Backend**: Supabase (Auth, PostgreSQL, Edge Functions)
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel + Supabase
- **Mobile (Planned)**: Flutter (iOS & Android)

For detailed specifications, see: [`PRD.md`](./PRD.md)

---

## 🧠 Core Technology

Varam Strength is built on modern web technologies designed for scalability, performance, and user experience:

### 🔧 Tech Stack

- **Frontend**: Astro + React + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Styling**: Tailwind CSS + AstroWind components
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel + Supabase
- **Email**: Nodemailer for booking confirmations
- **Content**: MDX for blog posts and documentation
- **Mobile (Planned)**: Flutter for cross-platform app

### 🏗️ Architecture Highlights

- **Server-Side Rendering**: Fast initial page loads with Astro
- **Real-Time Updates**: Live booking availability and notifications
- **Responsive Design**: Mobile-first approach for all devices
- **Type Safety**: TypeScript throughout the application
- **SEO Optimized**: Built-in SEO features with Astro

---

## 🧱 Training Framework

Our platform supports various training modalities:

| Training Type | Focus                            | Specialization                           |
| ------------- | -------------------------------- | ---------------------------------------- |
| Strength      | Power and muscle development     | Progressive overload principles          |
| Cardio        | Endurance and conditioning       | HIIT and steady-state training           |
| Mobility      | Flexibility and joint health     | Movement quality and range of motion     |
| Rehab         | Injury recovery and prevention   | Back, shoulder, and hip rehabilitation   |
| Stretching    | Recovery and flexibility         | Active and passive stretching techniques |
| HIIT          | High-intensity interval training | Metabolic conditioning                   |
| Custom        | Personalized programming         | Tailored to individual needs             |

---

## 📆 Booking System Features

### 🗓️ Smart Calendar

- Real-time availability checking
- Coach-specific time slots
- Automatic conflict prevention
- Mobile-responsive interface

### 👥 Coach Management

- Detailed coach profiles
- Specialization tracking
- Rehabilitation certifications
- Availability management

### 📧 Automated Notifications

- Booking confirmations
- Session reminders
- Cancellation notifications
- Admin alerts

---

## 🌍 Who It's For

- **General Population**: Individuals seeking personalized training guidance
- **Injury Recovery**: Clients with back, shoulder, or hip rehabilitation needs
- **Athletes**: Performance-focused training with expert coaching
- **Fitness Enthusiasts**: Structured programs for consistent progress
- **Coaches**: Platform for managing clients and schedules

> Inclusive by design. Personalized by expertise. Effective for life.

---

## 🔬 Development Roadmap

Varam Strength is continuously evolving to meet user needs.

### 🔧 Current Phase (MVP)

1. ✅ **User Authentication**: Email/password and magic link flows
2. ✅ **Booking System**: Calendar interface and session management
3. ✅ **Coach Profiles**: Detailed listings and specialization tracking
4. ✅ **Admin Dashboard**: User and booking management
5. ✅ **Blog Module**: Content publishing and management
6. 🔄 **Rehabilitation Programs**: Specialized injury recovery protocols

### 🎯 Future Enhancements

- **Payment Processing**: Integrated billing and subscription management
- **Video Coaching**: In-app video sessions and progress tracking
- **Mobile App**: Native iOS and Android applications using **Flutter**
- **Wearable Integration**: Fitness tracker and smartwatch connectivity
- **AI Coaching**: Personalized recommendations and progress insights

---

## 📣 Get Involved

Varam Strength is built with modern web technologies and welcomes contributions from the developer community.

### 🛠️ Development Setup

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### 🔒 Security Scanning

```bash
# Run all security checks
npm run security

# ESLint security scan only
npm run check:security

# Dependency vulnerability audit
npm run audit:security
```

> Join us in building the future of personalized fitness training.

---

## 📚 Documentation

- [`PRD.md`](./PRD.md) - Product Requirements Document
- [`tests/README.md`](./tests/README.md) - Testing Guide
- [`src/config.yaml`](./src/config.yaml) - Site Configuration
- [`astro.config.ts`](./astro.config.ts) - Astro Configuration

---

## 🔗 Links

- Website: [Varam Strength](https://varamfit.fit)
- Documentation: [Project Wiki](https://github.com/juheekim1217/hts/wiki)
- License: MIT

---

> "Train like you have a world-class coach—every day."

Varam Strength — _Train for life._
