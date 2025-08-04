# Intego360

Intego360 is a fullstack web application designed to manage and monitor agricultural, health, and educational data for cooperatives, farmers, schools, and health facilities. The project features a React frontend and a Node.js/Express backend with Sequelize ORM and PostgreSQL database, deployed on Render.com.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Related Files](#related-files)
- [License](#license)
- [Demo Video](#demo-video)
- [Live Project](#live-project)

---

## Features
- User authentication and role management
- Farmer, crop, and cooperative management
- Health facility, disease, and vaccination tracking
- School, student, teacher, and dropout management
- Market prices and productivity monitoring
- Feedback and reporting system

---

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Ant Design
- **Backend:** Node.js, Express, Sequelize ORM
- **Database:** PostgreSQL
- **Deployment:** Render.com

---

## Project Structure
```
intego/
  backend/      # Node.js/Express API
  frontend/     # React frontend app
```

---

## Installation & Setup

### Backend
1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the `backend/` directory with the following (example):
     ```env
     DB_USER= _db_user
     DB_PASSWORD= _db_password
     DB_NAME= _db_name
     DB_HOST=localhost
     DB_PORT=5432
     EMAIL_USERNAME= _email_user
     EMAIL_PASSWORD= _email_password
     EMAIL_HOST=smtp.example.com
     EMAIL_PORT=587
     JWT_SECRET= _jwt_secret
     ```
4. **Run database migrations:**
   ```bash
   npx sequelize-cli db:migrate
   ```
5. **Start the backend server:**
   ```bash
   node index.js
   ```
   The backend will run on `http://localhost:3000` by default.

### Frontend
1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the `frontend/` directory with:
     ```env
     VITE_API_URL=http://localhost:3000
     ```
4. **Run the frontend app:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` by default.

---

## Environment Variables

### Backend
- `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT` (for local dev)
- `POSTGRES_URL` (for production/Render)
- `EMAIL_USERNAME`, `EMAIL_PASSWORD`, `EMAIL_HOST`, `EMAIL_PORT`
- `JWT_SECRET`

### Frontend
- `VITE_API_URL` (URL of   backend API)

---

## Deployment (Render.com)

### Backend
- Deploy as a **Web Service**
- **Build Command:** `npm install`
- **Start Command:** `node index.js`
- Set environment variables in the Render dashboard (use `POSTGRES_URL` for DB connection)

### Frontend
- Deploy as a **Static Site**
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- Set `VITE_API_URL` to   backend's Render URL (e.g., `https://intego360.onrender.com`)

---

## Related Files
- `backend/config/config.js` – Sequelize and environment config
- `backend/models/` – Sequelize models
- `backend/migrations/` – Database migrations
- `backend/src/` – Express routes, controllers, middleware
- `frontend/src/` – React components, views, and utilities
- `frontend/package.json` – Frontend dependencies and scripts
- `backend/package.json` – Backend dependencies and scripts

---

## License
This project is for educational and demonstration purposes.

## Demo Video

Watch a walkthrough of the Intego360 project here:  
[Project Demo Video on Vimeo](https://vimeo.com/1098841259/1a2870df84?share=copy)

---

**Testing Credetials
** 
Admin. 
Email: jeannineuwasee@gmail.com
Passward: 4cd5b4f0ae576ef145b4
Once logged in as an admin, you can create additional users and assign them different roles to access the platform based on their responsibilities.



## Live Project

Access the deployed app here:  
[https://intego36.onrender.com/admin/dashboard](https://intego36.onrender.com/admin/dashboard)

> **Note:** This project is deployed on Render's free tier. The backend service may "sleep" after 15 minutes of inactivity. If you open the app and it takes a while to load, this is normal—please wait a moment for the server to wake up.

