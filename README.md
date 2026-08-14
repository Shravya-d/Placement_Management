Placement Management — README

Project Overview
Placement Management is a full-stack application for managing student placement activities, interviews, alumni records, and analytics. The repository contains a Node.js/Express backend (APIs, cron jobs, email notifications, matching logic) and a React + Vite frontend (admin, student, alumni UIs, dashboards and charts).

Technologies Used
Backend: Node.js, Express, Mongoose (MongoDB)
Frontend: React, Vite, Tailwind CSS
Auth & Security: JSON Web Tokens (JWT), cookie-based sessions
Other: Nodemailer (email), node-cron (scheduled jobs), Recharts (charts), GSAP (animations)

Repository Layout
Placement-management/backend/ — Express API, models, controllers, services
Placement-management/frontend/ — React + Vite UI
Placement-management/ — docs, top-level README

Requirements
Node.js (recommended >= 18)
npm (or yarn)
MongoDB instance (local or hosted)

Install Dependencies
From the repository root:

Backend:
cd backend
npm install

Frontend:
cd frontend
npm install

Run (Development)
Start the backend (auto-restarts with nodemon):
cd backend
npm run dev

Start the frontend (Vite dev server):
cd frontend
npm run dev

Access:
Frontend: visit the URL shown by Vite (typically http://localhost:5173)
Backend API: http://localhost:5000 (or PORT you configured)
