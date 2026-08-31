# 🛡️ SystemVault — Secure Cloud Storage Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Cloudinary-CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
</p>

A modern, full-stack **MERN Cloud Storage & Vault Application** inspired by Google Drive, Linear, and Raycast. Featuring end-to-end file management, nested folder hierarchies, drag-and-drop uploads, in-app rich media previews, 30-day trash recovery, Google OAuth 2.0, storage quota meters, and an ultra-clean obsidian dark/light UI.

---

## ✨ Features

- **🔐 Dual Authentication**:
  - Secure JWT authentication (Access & Refresh tokens) with bcrypt password hashing.
  - Seamless **Google OAuth 2.0 Sign-In & Sign-Up** popup integration.
  - Automatic session recovery and protected private routes.
- **📁 Nested Folder Organization**:
  - Infinite subfolder nesting with interactive breadcrumb navigation.
  - Create, rename, move, and soft-delete folders.
  - Cycle prevention (prevents moving parent folders into their own children).
- **☁️ Drag-and-Drop File Management**:
  - Drag & drop files anywhere on screen with animated dropzones.
  - Real-time multi-file upload progress percentages (`0%` ➔ `100%`).
  - Powered by Cloudinary CDN with automatic MIME-type categorization.
- **👁️ Universal In-App Previews**:
  - **Images**: Zoom in/out, pan, and high-res preview.
  - **Videos**: Built-in HTML5 video streaming player (MP4, MKV, WebM, MOV).
  - **Audio**: Inline waveform audio player (MP3, WAV, OGG, M4A, FLAC).
  - **PDFs**: Embedded document reader with page controls.
  - **Code & Documents**: Syntax badge with 1-click downloads.
- **🗑️ Trash & 30-Day Recovery Bin**:
  - Soft-delete protection: items moved to Trash can be restored in 1-click.
  - Permanent purge: permanently removes files from Cloudinary and frees account storage.
- **📊 Real-Time Storage Analytics**:
  - Visual quota progress bar tracking user storage vs limit (default: 1.0 GB).
- **🔍 Spotlight-Style Command Search**:
  - Real-time cross-vault search with keyboard shortcut (`⌘K` / `Ctrl+K`) and instant dropdown.
- **🌓 Modern Obsidian UI**:
  - Deep obsidian dark mode & clean light mode with persistent theme memory.
  - Glassmorphic modals, smooth layout animations, and zero layout shifts.

---

## 🏗️ Project Architecture

```
SystemVault/
├── backend/                  # Express.js REST API Server
│   ├── server/
│   │   ├── config/           # Database & JWT token generators
│   │   ├── controllers/      # Auth, Folder, File, and Search business logic
│   │   ├── middleware/       # JWT Protect & Multer upload handlers
│   │   ├── models/           # Mongoose Schemas (User, Folder, File)
│   │   ├── routes/           # Express Route definitions
│   │   └── server.js         # Entry point & CORS configuration
│   └── .env.example          # Sample environment variables for backend
│
├── frontend/                 # React 18 + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/         # ProtectedRoute wrapper
│   │   │   ├── common/       # Sidebar, Navbar, Breadcrumbs, StorageMeter
│   │   │   ├── modals/       # Upload, CreateFolder, Preview, Rename, Move
│   │   │   └── vault/        # FolderCard, FolderRow, FileCard, FileRow
│   │   ├── context/          # AuthContext, VaultContext, ThemeContext, ToastContext
│   │   ├── pages/            # LoginPage, RegisterPage, DashboardPage, TrashPage, SearchPage
│   │   ├── services/         # Axios API clients (auth, folder, file, search)
│   │   └── utils/            # Formatters & MIME file type helpers
│   ├── index.html
│   ├── vite.config.js        # Vite config with backend /api proxy
│   └── tailwind.config.js    # Custom modern color palette
│
├── FRONTEND_ARCHITECTURE.md  # Detailed frontend blueprint
└── README.md
```

---

## 🚀 Step-by-Step Installation & Run Guide

### 1. Prerequisites
Make sure you have the following installed on your computer:
- **Node.js** (v18 or higher) — [Download Node.js](https://nodejs.org/)
- **Git** — [Download Git](https://git-scm.com/)
- Free accounts for:
  - **MongoDB Atlas** (Database) — [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  - **Cloudinary** (Media CDN Storage) — [Cloudinary](https://cloudinary.com/)
  - **Google Cloud Console** (Optional, for Google OAuth) — [Google Cloud](https://console.cloud.google.com/)

---

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/SystemVault.git
cd SystemVault
```

---

### 3. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` folder:
   ```env
   PORT=3000
   CLIENT_URL=http://localhost:5173
   
   # MongoDB Connection String
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/SystemVault?retryWrites=true&w=majority
   
   # JWT Secrets (Random 64+ char strings)
   JWT_SECRET=your_super_secret_jwt_access_key
   JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key
   
   # Cloudinary Credentials (from Cloudinary Dashboard)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Google OAuth Client ID (Optional, for Google Token Verification)
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   > Server will start on `http://localhost:3000` with MongoDB connected.

---

### 4. Frontend Setup

1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` folder:
   ```env
   # Google OAuth Client ID (from Google Cloud Console)
   VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```
4. Start the Vite frontend dev server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🔑 Setting up Google OAuth 2.0 (Optional)

1. Go to **[Google Cloud Console](https://console.cloud.google.com/)** & create a new project (e.g. `SystemVault`).
2. Navigate to **APIs & Services > OAuth consent screen**:
   - Select **External**, set App Name to `SystemVault`, and add your email.
3. Navigate to **APIs & Services > Credentials**:
   - Click **+ CREATE CREDENTIALS** > **OAuth client ID**.
   - Application type: **Web application**.
   - **Authorized JavaScript origins**: `http://localhost:5173`
   - **Authorized redirect URIs**: `http://localhost:5173`
4. Copy the generated **Client ID** and paste it into `frontend/.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxx-xxxxxxxx.apps.googleusercontent.com
   ```
5. Restart your frontend server (`npm run dev`).

---

## 📡 API Reference Overview

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in with email & password
- `POST /api/auth/google` — Sign in / sign up with Google OAuth token
- `GET /api/auth/me` — Retrieve current authenticated user profile & storage quota

### 📁 Folders (`/api/folder`)
- `GET /api/folder?parentId=:id` — Get subfolders (or root folders if `parentId=null`)
- `GET /api/folder/:id` — Get folder details by ID
- `POST /api/folder` — Create a new folder
- `PUT /api/folder/:id` — Rename a folder
- `PUT /api/folder/:id/move` — Move folder to a new parent folder or root
- `POST /api/folder/trash/:id` — Soft-delete folder to Trash
- `GET /api/folder/trash/all` — Get all trashed folders
- `POST /api/folder/restore/:id` — Restore folder from Trash
- `DELETE /api/folder/permanent/:id` — Permanently delete folder

### ☁️ Files (`/api/file`)
- `GET /api/file?folderId=:id` — Get files inside a folder
- `POST /api/file/upload` — Upload a file (`multipart/form-data`) with folder link
- `GET /api/file/:id` — Get file details
- `PUT /api/file/:id` — Rename a file
- `PUT /api/file/:id/move` — Move file to another folder
- `GET /api/file/download/:id` — Download file with original filename
- `POST /api/file/trash/:id` — Soft-delete file to Trash
- `GET /api/file/trash/all` — Get all trashed files
- `POST /api/file/restore/:id` — Restore file from Trash
- `DELETE /api/file/permanent/:id` — Permanently delete file from Cloudinary & database

### 🔍 Search (`/api/search`)
- `GET /api/search?q=:query` — Cross-vault search across all folders and files

---

## 🛡️ License

Distributed under the **MIT License**. Feel free to use, modify, and build upon this project.

---

<p align="center">
  Built with ❤️ by <strong>Asmit</strong>
</p>
