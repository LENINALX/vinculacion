import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import AuthModal from '../modals/AuthModal';
import UploadModal from '../modals/UploadModal';

const PageLayout = ({
  children,
  onUploadSuccess,
  className = 'min-h-screen bg-[#FFFADA]'
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleCloseAuth = () => setShowAuthModal(false);
  const handleCloseUpload = () => setShowUploadModal(false);

  const handleUploadSuccess = () => {
    onUploadSuccess?.();
    handleCloseUpload();
  };

  return (
    <div className={`${className} flex flex-col`}>
      <Header
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenUploadModal={() => setShowUploadModal(true)}
      />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={handleCloseAuth}
      />

      <UploadModal
        isOpen={showUploadModal}
        onClose={handleCloseUpload}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default PageLayout;
