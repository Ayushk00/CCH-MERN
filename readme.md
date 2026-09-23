# Campus CareerHub

Campus CareerHub is a web platform architected using the **MERN stack (MongoDB, Express.js, React, Node.js)**, designed to streamline placement interactions between companies and IIITA students. The platform enhances efficiency by automating processes and reducing manual work.

## Features

- **Seamless Company-Student Interaction:** Facilitates **one-to-many** connections for placement opportunities.
- **Admin Panel:** Provides end-to-end process monitoring, resulting in a **50% reduction in manual workload** through **process optimization and automation**.
- **Scalable System:** Efficiently handles over **100+ concurrent users**.
- **Optimized Performance:** Utilizes **constant time (O(1)) CRUD operations** powered by **MongoDB's indexing and sharding capabilities**.
- **Event-Driven Architecture:** Leverages **asynchronous I/O operations** and **event loops** to manage real-time updates.

## Roles and Workflow

- **Admin** (no sign-up; created from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `server/server/.env` on first start, or with `npm run seed:admin`)
  - Approves new student and recruiter accounts; nobody can use the portal until approved
  - Disables / re-enables accounts and reviews "enable my profile" requests from disabled users
  - Views every job posting with its applicants and can remove any posting
  - Tracks placements: each student's stage (In Progress / Selected / Placed / Rejected) with the company
  - Posts notices for students, recruiters, or both
- **Recruiter**: posts openings, views applicants and their resumes, shortlists, schedules interviews (the student is emailed the time and link), and marks candidates selected or rejected
- **Student**: completes the profile, uploads a PDF resume, sees all openings with eligibility (batch, branch, CGPA, deadline), applies only when eligible, accepts interviews, and accepts or declines offers

Application lifecycle: `applied -> shortlisted -> interview_scheduled -> interview_accepted -> selected -> offer_accepted | offer_declined` (the recruiter can reject at any point before the offer is answered).

### Email

Interview invitations and decisions are emailed with Nodemailer. Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` and `MAIL_FROM` in `.env` for real delivery (for Gmail use an App Password). If `SMTP_HOST` is empty, emails go to a free [Ethereal](https://ethereal.email) test inbox and the recruiter's screen shows a "view test email" link.

Uploaded resumes are stored in `server/server/uploads/resumes/` (git-ignored).

## Security

- Auth tokens live only in `httpOnly`, `SameSite=Strict` cookies (never in the response body or `localStorage`). Set `COOKIE_SAMESITE=none` with HTTPS only if the frontend and API are on different sites.
- The frontend asks the server who is signed in (`GET /api/auth/me`); nothing in the browser is trusted for access decisions. Every portal area is role-guarded, and forbidden or unknown URLs fall back to the login page with an explanation.
- Tabs share one session: signing in or out in one tab updates the others, and a tab never keeps showing the previous user's data.
- The API checks the role and resource ownership on every request, so a recruiter can only see their own drives and applicants, and a student only their own data and resume. Disabled accounts are blocked on their next request.
- Security headers (helmet), rate limiting on login, registration and account actions, removal of `$`/dotted keys from request data (NoSQL injection), request size limits, password rules (8+ characters with a letter and a number), and generic 500 errors.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Version Control:** Git

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/Ayushk00/CCH-MERN
cd CCH-MERN
```
2. Configure the backend environment:
```bash
cd server/server
cp .env.example .env   # then set MONGODB_URI and the token secrets
```
3. Install dependencies:
```bash
# Backend
cd server/server
npm install

# Frontend
cd client/client
npm install
```
4. Start the backend (API on http://localhost:3000, the frontend expects this port):
```bash
cd server/server
npm start
```
5. Start the frontend:
```bash
cd client/client
npm run dev
```
6. Open the application at:
```
http://localhost:5173
```
