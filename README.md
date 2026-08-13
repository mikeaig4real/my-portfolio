# Neobrutalist Bento Portfolio & Studio Engine

A high-performance, modular Next.js portfolio system built with a neobrutalist aesthetic, interactive Bento grid canvas, real-time inline editing studio, and plug-and-play multi-database architecture.

## Overview

This repository provides an enterprise-ready portfolio and resume engine featuring:
- Interactive Bento Grid layout with flexible column/row span units.
- Real-time inline text and media editor with stealth admin access.
- Universal database adapter supporting local JSON storage, Drizzle ORM (SQLite / LibSQL), and MongoDB Atlas.
- Automatic data reconciliation layer for legacy database schema upgrades.
- AI-assisted CV onboarding and resume parsing integration.
- Automated Vercel pre-deployment validation pipeline.

---

## Technical Stack

- Framework: Next.js 15 (App Router, Server Actions, API Routes)
- Language: TypeScript 5
- Styling: Tailwind CSS v4, Vanilla CSS Design System, Framer Motion
- State Management: Zustand with persistent storage
- Data Validation: Zod schema definitions
- Utilities: Lucide Icons, Canvas Confetti, Faker.js, NanoID
- Database Adapters: Drizzle ORM, SQLite, MongoDB (Mongoose)

---

## Architecture & Database Layer

The application operates on a unified database abstraction layer (`lib/db/index.ts`) allowing seamless switching between data storage providers via environment variables.

### Supported Database Providers

Set `DATABASE_PROVIDER` in your environment file:

1. `sqlite` (JSON File Storage): Uses `.storage/portfolio.json` for lightweight local persistence without external database software.
2. `drizzle` (Drizzle ORM SQLite / LibSQL): Uses `.storage/portfolio.db` via Drizzle ORM for structured relational persistence.
3. `mongodb` (MongoDB Atlas / Server): Uses Mongoose models for cloud document database persistence.

### Data Reconciliation Strategy

To reconcile pre-existing local database files with newer application schemas or default portfolio data:
- The system automatically executes `reconcilePortfolioData()` upon reading from SQLite or JSON storage.
- Missing singleton cards (Hero Profile, Workplace, Tech Stack, Socials) and missing profile attributes are auto-merged into stored datasets without overwriting existing user modifications.
- Read-only serverless filesystems (such as Vercel Edge/Serverless runtime) automatically fall back gracefully to temporary storage or memory to prevent operational runtime failures.

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mikeaig4real/my-portfolio.git
cd my-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

Open `http://localhost:3000` in your browser to access the portfolio viewer.

---

## Stealth Admin & Studio Management

To unlock the live editor and access `/admin`:
- **Desktop**: Press `Ctrl + Alt + Shift + [KEY]` on the landing page, where key is defined by `NEXT_PUBLIC_ADMIN_UNLOCK_KEY` (default: `p`), or navigate directly to `/admin`.
- **Mobile**: Rapidly tap the copyright text in the footer `N` times, where tap count is defined by `NEXT_PUBLIC_MOBILE_ADMIN_TAP_COUNT` (default: `5`), to open the mobile-optimized admin passcode modal.
- Log in using the `ADMIN_PASSWORD` defined in your environment variables.

---

## Pre-Deployment Verification & Vercel Setup

Before pushing commits or deploying to production, execute the automated pre-deployment audit script:

```bash
npm run prepare-deploy
```

The script performs the following validation steps:
1. Runs full TypeScript compilation (`tsc --noEmit`).
2. Performs a dry-run Next.js production build (`next build`).
3. Audits `.gitignore` to ensure `.env.local` and local database files are excluded from version control.
4. Generates and opens a direct Vercel import URL linked to your GitHub repository.

---

## Deployment to Vercel

1. Push your repository to GitHub.
2. Run `npm run prepare-deploy` to trigger automated validation and open the Vercel deployment portal.
3. Connect your GitHub repository on Vercel.
4. Add the required environment variables (`ADMIN_PASSWORD`, `SECRET_KEY`, `DATABASE_PROVIDER`, etc.) in the Vercel project settings.
5. Deploy the application. Vercel will automatically build and publish your project on every push to `main`.

---

## License

Private repository. All rights reserved.
