import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const outputPath = path.resolve('c:/Users/ASHMIT/Mern-Projects/SystemVault/SystemVault_Frontend_Architecture.pdf');
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 40, left: 45, right: 45 },
  bufferPages: true,
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Colors
const PRIMARY = '#6d28d9';    // Deep Violet
const SECONDARY = '#0f172a';  // Dark Slate
const TEXT_DARK = '#1e293b';  // Slate-800
const TEXT_MUTED = '#64748b'; // Slate-500
const CARD_BG = '#f8fafc';    // Slate-50
const BORDER = '#e2e8f0';     // Slate-200

function drawHeader(title, subtitle) {
  doc.rect(45, 35, 505, 4).fill(PRIMARY);
  doc.fontSize(18).fillColor(SECONDARY).font('Helvetica-Bold').text(title, 45, 48);
  if (subtitle) {
    doc.fontSize(9.5).fillColor(TEXT_MUTED).font('Helvetica').text(subtitle, 45, 72);
  }
  doc.moveDown(1.5);
}

function drawSectionHeading(num, title) {
  doc.moveDown(0.8);
  const y = doc.y;
  doc.rect(45, y, 18, 16).fillAndStroke(PRIMARY, PRIMARY);
  doc.fontSize(9.5).fillColor('#ffffff').font('Helvetica-Bold').text(num, 45, y + 3, { width: 18, align: 'center' });
  doc.fontSize(12).fillColor(SECONDARY).font('Helvetica-Bold').text(title, 70, y + 2);
  doc.moveDown(0.7);
  doc.rect(45, doc.y, 505, 1).fill(BORDER);
  doc.moveDown(0.5);
}

// ----------------------------------------------------
// PAGE 1: TITLE & HIGH-LEVEL ARCHITECTURE
// ----------------------------------------------------
drawHeader('SystemVault — Frontend Architecture & Flow', 'Comprehensive Developer Blueprint & Component Reference Guide');

drawSectionHeading('1', 'High-Level System Architecture & Layering');

doc.fontSize(9).fillColor(TEXT_DARK).font('Helvetica').text(
  'SystemVault is a modern Cloud Storage Single Page Application built on React 18, Vite, and Tailwind CSS. The frontend is organized into 5 decoupled layers ensuring clean separation of concerns:',
  { lineGap: 2 }
);
doc.moveDown(0.5);

const archY = doc.y;
doc.rect(45, archY, 505, 115).fillAndStroke('#0f172a', '#0f172a');

doc.fontSize(8.5).fillColor('#a78bfa').font('Helvetica-Bold').text('1. USER INTERFACE LAYER (PAGES & VIEWS)', 55, archY + 10);
doc.fontSize(8).fillColor('#94a3b8').font('Helvetica').text('LoginPage  |  RegisterPage  |  DashboardPage (Explorer)  |  SearchPage  |  TrashPage', 55, archY + 22);

doc.fontSize(8.5).fillColor('#38bdf8').font('Helvetica-Bold').text('2. COMPONENT & MODAL LAYER', 55, archY + 38);
doc.fontSize(8).fillColor('#94a3b8').font('Helvetica').text('Sidebar (Drawer)  |  Navbar (Command Search)  |  FolderCard/Row  |  FileCard/Row  |  Modals (6)', 55, archY + 50);

doc.fontSize(8.5).fillColor('#4ade80').font('Helvetica-Bold').text('3. GLOBAL STATE & CONTEXT ENGINE', 55, archY + 66);
doc.fontSize(8).fillColor('#94a3b8').font('Helvetica').text('AuthContext (JWT/OAuth)  |  VaultContext (Explorer/Uploads)  |  ToastContext  |  ThemeContext', 55, archY + 78);

doc.fontSize(8.5).fillColor('#facc15').font('Helvetica-Bold').text('4. SERVICE & HTTP CLIENT LAYER (Axios)', 55, archY + 94);
doc.fontSize(8).fillColor('#94a3b8').font('Helvetica').text('api.js (Bearer Interceptors) ──► authService, folderService, fileService, searchService', 55, archY + 106);

doc.y = archY + 125;
doc.moveDown(0.5);

drawSectionHeading('2', 'Application Routes & Page Responsibilities');

const pages = [
  { route: '/login', comp: 'LoginPage.jsx', desc: 'Email/Password sign-in, Google OAuth 2.0 popup integration, error alerts, and redirect on login.' },
  { route: '/register', comp: 'RegisterPage.jsx', desc: 'Account creation, password validation (>=6 chars), Google OAuth sign-up, and confetti celebration.' },
  { route: '/', comp: 'DashboardPage.jsx', desc: 'Root folder explorer. Shows top-level folders, quick storage statistics, and empty state guides.' },
  { route: '/folder/:id', comp: 'DashboardPage.jsx', desc: 'Subfolder explorer. Fetches contents for folderId, supports drag-and-drop file upload, file filters.' },
  { route: '/search', comp: 'SearchPage.jsx', desc: 'Full-vault search matching folders and files with category filtering and instant query updates.' },
  { route: '/trash', comp: 'TrashPage.jsx', desc: 'Recycle bin. Lists soft-deleted folders and files with 1-click restore or permanent purge.' },
  { route: '*', comp: 'NotFoundPage.jsx', desc: '404 fallback page with a 1-click navigation button back to Vault Home.' },
];

pages.forEach((p, idx) => {
  const py = doc.y;
  doc.rect(45, py, 505, 25).fillAndStroke(idx % 2 === 0 ? '#f8fafc' : '#ffffff', BORDER);
  doc.fontSize(8.5).fillColor(PRIMARY).font('Helvetica-Bold').text(p.route, 52, py + 7, { width: 75 });
  doc.fontSize(8.5).fillColor(SECONDARY).font('Helvetica-Bold').text(p.comp, 130, py + 7, { width: 105 });
  doc.fontSize(8).fillColor(TEXT_DARK).font('Helvetica').text(p.desc, 240, py + 5, { width: 300, lineGap: 1 });
  doc.y = py + 25;
});

// ----------------------------------------------------
// PAGE 2: COMPONENTS & MODALS
// ----------------------------------------------------
doc.addPage();
drawHeader('SystemVault — Component & Modal Reference', 'Detailed Directory Hierarchy & Functional Breakdown');

drawSectionHeading('3', 'Common Layout & Shell Components');

const commonComps = [
  { name: 'Sidebar.jsx', role: 'Desktop & mobile collapsible navigation drawer. Contains brand logo, quick "+ New Item" popup, real-time file upload progress queue, storage meter, and user profile card with theme toggle and logout.' },
  { name: 'Navbar.jsx', role: 'Sticky top command bar with keyboard shortcut (Cmd/Ctrl+K) search bar, instant live search dropdown, sort order dropdown (Date, Name, Size), and Grid/List view toggle.' },
  { name: 'Breadcrumbs.jsx', role: 'Interactive ancestry path navigator (e.g. Root > Projects > 2026). Allows 1-click navigation up the directory tree.' },
  { name: 'StorageMeter.jsx', role: 'Storage usage gauge displaying user quota (e.g., 42 MB of 1.0 GB) with dynamic color bar (emerald > amber > rose).' },
  { name: 'EmptyState.jsx', role: 'Clean minimalist illustration placeholders for empty directories, empty trash bin, and zero search matches.' },
  { name: 'LoadingSpinner.jsx', role: 'Smooth violet loading spinner and pulse skeleton cards for seamless loading states.' },
];

commonComps.forEach((c) => {
  const cy = doc.y;
  doc.rect(45, cy, 505, 30).fillAndStroke(CARD_BG, BORDER);
  doc.fontSize(9).fillColor(PRIMARY).font('Helvetica-Bold').text(c.name, 55, cy + 5, { width: 120 });
  doc.fontSize(8).fillColor(TEXT_DARK).font('Helvetica').text(c.role, 180, cy + 4, { width: 360, lineGap: 1.2 });
  doc.y = cy + 33;
});

drawSectionHeading('4', 'Vault Explorer & Interactive Modals');

const vaultComps = [
  { name: 'FolderCard & FolderRow', role: 'Folder items rendered in Grid or List view. Displays folder name, date, and 3-dot dropdown (Rename, Move, Delete).' },
  { name: 'FileCard & FileRow', role: 'File items rendered in Grid or List view. Displays thumbnail/icon, formatted byte size, date, and quick preview/download overlay.' },
  { name: 'UploadFileModal.jsx', role: 'Drag-and-drop file upload modal allowing folder destination selection, batch file management, and instant upload dispatch.' },
  { name: 'CreateFolderModal.jsx', role: 'Dialog to create a new folder inside the current directory or vault root.' },
  { name: 'FilePreviewModal.jsx', role: 'Full-screen viewer supporting Images (zoom in/out), Videos (inline player), Audio (playback), PDFs (embedded viewer), and direct download.' },
  { name: 'RenameModal.jsx', role: 'Modal to rename folders or files without affecting cloud storage identifiers.' },
  { name: 'MoveModal.jsx', role: 'Folder tree selector allowing users to relocate any folder or file to a new parent folder or root.' },
  { name: 'ConfirmDeleteModal.jsx', role: 'Confirmation dialog for moving items to Trash (soft delete) or permanent CDN purge with safety warnings.' },
];

vaultComps.forEach((m) => {
  const my = doc.y;
  doc.rect(45, my, 505, 27).fillAndStroke('#ffffff', BORDER);
  doc.fontSize(8.5).fillColor(SECONDARY).font('Helvetica-Bold').text(m.name, 55, my + 5, { width: 130 });
  doc.fontSize(8).fillColor(TEXT_DARK).font('Helvetica').text(m.role, 190, my + 4, { width: 350, lineGap: 1.1 });
  doc.y = my + 29;
});

// ----------------------------------------------------
// PAGE 3: STATE MANAGEMENT & DATA FLOW
// ----------------------------------------------------
doc.addPage();
drawHeader('SystemVault — State Architecture & Operational Flows', 'Context Providers, API Services & End-to-End Execution Lifecycles');

drawSectionHeading('5', 'Global Context State Engines (Context API)');

const contexts = [
  {
    name: 'AuthContext.jsx',
    desc: 'Manages user authentication lifecycle. Stores accessToken in localStorage and syncs profile from GET /api/auth/me.',
    methods: 'user, token, isAuthenticated, isLoading, login(), register(), googleLogin(), logout(), refreshUserProfile()',
  },
  {
    name: 'VaultContext.jsx',
    desc: 'Central explorer data engine. Fetches folder tree, handles file uploads, manages active modals, and tracks upload progress queue.',
    methods: 'currentFolder, folders, files, breadcrumbs, viewMode, sortBy, uploadQueue, handleUploadFiles(), handleCreateFolder(), handleRename(), handleMove(), handleDelete()',
  },
  {
    name: 'ThemeContext.jsx',
    desc: 'Controls Dark/Light mode theme. Adds/removes .dark class on <html> document and persists preference in localStorage.',
    methods: 'theme ("dark" | "light"), toggleTheme(), isDark',
  },
  {
    name: 'ToastContext.jsx',
    desc: 'Global floating notification system. Emits toast alerts with auto-dismiss (success, error, warning, info).',
    methods: 'toast.success(msg), toast.error(msg), toast.warning(msg), toast.info(msg)',
  },
];

contexts.forEach((ctx) => {
  const cy = doc.y;
  doc.rect(45, cy, 505, 46).fillAndStroke(CARD_BG, BORDER);
  doc.fontSize(9.5).fillColor(PRIMARY).font('Helvetica-Bold').text(ctx.name, 55, cy + 5);
  doc.fontSize(8).fillColor(TEXT_DARK).font('Helvetica').text(ctx.desc, 55, cy + 17, { width: 485, lineGap: 1 });
  doc.fontSize(7.5).fillColor(TEXT_MUTED).font('Courier-Bold').text(`Exposed: ${ctx.methods}`, 55, cy + 32, { width: 485 });
  doc.y = cy + 50;
});

drawSectionHeading('6', 'Key End-to-End Workflows');

doc.fontSize(8.5).fillColor(SECONDARY).font('Helvetica-Bold').text('Workflow 1: File Upload with Live Progress Tracking', 45, doc.y);
doc.moveDown(0.2);
const f1 = doc.y;
doc.rect(45, f1, 505, 50).fillAndStroke('#0f172a', '#0f172a');
doc.fontSize(7.5).fillColor('#94a3b8').font('Courier').text(
`1. User drops files -> VaultContext.handleUploadFiles(files, targetFolderId)
2. A temporary item is pushed into uploadQueue with progress: 0%
3. fileService.uploadFile() sends FormData with Axios onUploadProgress callback
4. UploadQueue updates progress bar in real time (e.g. 15% -> 60% -> 100%)
5. Backend uploads to Cloudinary, stores file in MongoDB, updates user's usedStorage
6. VaultContext refreshes folder list and emits success toast`, 52, f1 + 6, { lineGap: 1.8 });

doc.y = f1 + 56;
doc.moveDown(0.3);

doc.fontSize(8.5).fillColor(SECONDARY).font('Helvetica-Bold').text('Workflow 2: Safe Deletion & Trash Lifecycle', 45, doc.y);
doc.moveDown(0.2);
const f2 = doc.y;
doc.rect(45, f2, 505, 46).fillAndStroke('#0f172a', '#0f172a');
doc.fontSize(7.5).fillColor('#94a3b8').font('Courier').text(
`1. User clicks 3-Dots -> Delete -> ConfirmDeleteModal opens
2. Soft Delete: calls POST /api/file/trash/:id (sets isTrash: true) -> Item moves to TrashPage
3. Restore: User clicks "Restore" on TrashPage -> calls POST /api/file/restore/:id
4. Permanent Purge: Calls DELETE /api/file/permanent/:id -> destroys file on Cloudinary,
   deletes MongoDB document, and frees usedStorage bytes from the user account`, 52, f2 + 6, { lineGap: 1.8 });

doc.y = f2 + 52;
doc.moveDown(0.3);

doc.fontSize(8.5).fillColor(SECONDARY).font('Helvetica-Bold').text('Workflow 3: Google OAuth 2.0 Sign-In Flow', 45, doc.y);
doc.moveDown(0.2);
const f3 = doc.y;
doc.rect(45, f3, 505, 46).fillAndStroke('#0f172a', '#0f172a');
doc.fontSize(7.5).fillColor('#94a3b8').font('Courier').text(
`1. User clicks "Continue with Google" -> @react-oauth/google opens Google popup
2. Frontend receives access_token -> calls AuthContext.googleLogin(token)
3. POST /api/auth/google verifies token with Google API (oauth2/v3/userinfo)
4. Backend finds/creates user in MongoDB, generates JWT accessToken & refreshToken
5. Frontend stores accessToken in localStorage, redirects user to Dashboard`, 52, f3 + 6, { lineGap: 1.8 });

// ----------------------------------------------------
// PAGE NUMBERS & FINALIZE
// ----------------------------------------------------
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  doc.fontSize(8).fillColor(TEXT_MUTED).font('Helvetica').text(
    `SystemVault Documentation — Page ${i + 1} of ${range.count}`,
    45,
    doc.page.height - 25,
    { align: 'center', width: 505 }
  );
}

doc.end();
writeStream.on('finish', () => {
  console.log(`PDF successfully written to: ${outputPath}`);
});

