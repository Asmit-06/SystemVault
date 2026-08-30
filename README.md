# 🛡️ SystemVault - Secure Cloud Storage Application

A full-stack MERN cloud storage and vault application featuring secure authentication, folder hierarchies, drag-and-drop file uploads (backed by Cloudinary), live search, in-browser media previews, soft deletes with recovery trash, storage analytics, and dark/light mode.

---

## ✨ Features

- **🔐 Authentication & Security**:
  - JWT Access & Refresh token authentication with protected routes.
  - User session persistence and auto-logout on token expiration.
- **📁 Folder Management**:
  - Nested folder hierarchies with deep breadcrumb navigation.
  - Create, rename, move, and soft-delete folders.
  - Prevent recursive parent-child cycle moves.
- **☁️ File Management**:
  - Drag-and-drop multi-file upload with live progress bars.
  - Cloudinary-backed storage with automatic mime-type categorization.
  - In-browser rich previews for Images, Videos, Audio, PDFs, and Code.
  - Direct file downloads with preserved original filenames.
  - Rename, move between folders, and soft-delete files.
- **🗑️ Trash & Recovery Bin**:
  - Dedicated trash center displaying soft-deleted folders and files.
  - One-click restore to original folder location.
  - Permanent deletion with automated Cloudinary cleanup.
- **🔍 Instant Live Search**:
  - Global search querying both folders and files across the entire vault.
  - Instant dropdown results with direct navigation.
- **📊 Storage Meter & Analytics**:
  - Visual gauge of used storage vs 1.0 GB limit with color-coded alerts.
- **🌓 Theme & Responsive UI**:
  - Dark mode and Light mode with localStorage persistence.
  - Mobile-friendly responsive sidebar and modern glassmorphism design.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB
- Cloudinary Account

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev # Starts server on http://localhost:3000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev # Starts Vite dev server on http://localhost:5173
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Router v6
- **Backend**: Node.js, Express, MongoDB (Mongoose), Cloudinary SDK, Multer, JWT, Bcrypt
