# SCI Top Committee Election & Voting Portal (2026/2027)

Official online voting, nomination, live results, and election operations portal for the **School of Computing and Informatics (SCI)** at **Albukhary International University (AIU)**.

## Features Implemented (Aligned with 2026/2027 Election Handbook)

- **Student Authentication & Eligibility Enforcement**: Split-screen `@student.aiu.edu.my` login and registration with AIU Student ID normalization (e.g., `AIU24102323`) and email verification checks.
- **Home Dashboard & Election Schedule**: Real-time turnout stats, approved contestant slot counter (`X / 15`), direct PDF downloads (`ELECTION_HANDBOOK.pdf` and `Nomination_Form.pdf`), and the official Nov-Dec 2026 schedule.
- **Candidates Directory & Manifesto Viewer**: Programme filters (`Computer Science`, `Data Science`, `IT Cybersecurity`), keyword search, verified CGPA/Dean endorsement indicators, and full manifesto modals.
- **Become a Candidate Workflow**: Validates Year 2+ standing, minimum CGPA `3.00`, Dean endorsement confirmation, clean discipline declaration, client-side portrait compression (`320x320`), and enforces the strict 15-contestant maximum cap.
- **Interactive Ballot & Verified Receipt**: Allows 1 to 4 candidate selections with confirmation dialog, one-ballot-per-student lock, and downloadable/printable verification receipt.
- **Live Results & Top 8 Interview Cutoff**: Real-time vote standings with an explicit **Top 8 Interview Shortlist Cutoff** marker and post-interview Top Committee appointments (`President`, `Vice President`, `Secretary`, `Treasurer`).
- **Technical & Returning Officer Admin Console**: Switch election phases, toggle live result visibility, approve/reject nomination queue (with 15-cap guard), manually add or edit endorsed candidates, assign Top 4 roles, export CSV tally reports, and inspect audit logs.
- **Dual-Mode Persistence**: Works immediately offline/locally via `localStorage` + `BroadcastChannel` Demo Mode (with instant persona and phase simulator controls) and switches automatically to **Firebase Auth + Cloud Firestore** when `.env.local` is configured.

## Quick Start (Local Demo Mode)

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. Use the **Instant Local Demo Access** buttons on the login screen (or the **Technical Officer Simulator** bar at the top) to switch between Admin (`Abdulkarem Abubakar Ajogal - AIU24102323`), fresh student voter, and completed voter states.

## Connecting Firebase for Production Deployment

1. Create or reuse a Firebase project and enable **Authentication (Email/Password)** and **Cloud Firestore**.
2. Copy `.env.example` to `.env.local` and populate all `VITE_FIREBASE_*` keys.
3. Deploy Firestore security rules and static build via Firebase CLI:

```bash
npm run build
firebase deploy
```
