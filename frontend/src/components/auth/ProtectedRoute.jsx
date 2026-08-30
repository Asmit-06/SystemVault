import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import CreateFolderModal from '../modals/CreateFolderModal';
import UploadFileModal from '../modals/UploadFileModal';
import RenameModal from '../modals/RenameModal';
import MoveModal from '../modals/MoveModal';
import FilePreviewModal from '../modals/FilePreviewModal';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import LoadingSpinner from '../common/LoadingSpinner';

export const ProtectedLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#09090b]">
        <LoadingSpinner size="lg" text="Authenticating SystemVault..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-[#fafafa] dark:bg-[#09090b]">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area - Pl-64 to match Sidebar w-64 */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      <CreateFolderModal />
      <UploadFileModal />
      <RenameModal />
      <MoveModal />
      <FilePreviewModal />
      <ConfirmDeleteModal />
    </div>
  );
};

export default ProtectedLayout;
