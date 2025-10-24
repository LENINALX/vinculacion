import React, { useState } from 'react';
import { Menu, X, Upload, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Header = ({ onOpenAuthModal, onOpenUploadModal }) => {
  const { user, userProfile, signOut, isArtist } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const { success } = await signOut();
    if (success) {
      setMobileMenuOpen(false);
    }
  };

  const getUserTypeLabel = () => {
    if (!userProfile) return '';
    const labels = {
      admin: 'Administrador',
      artist: 'Artista',
      client: 'Cliente'
    };
    return labels[userProfile.user_type] || '';
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              SubastArte
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#inicio" className="text-gray-700 hover:text-purple-600 transition">
              Inicio
            </a>
            <a href="#subastas" className="text-gray-700 hover:text-purple-600 transition">
              Subastas
            </a>
            <a href="#artistas" className="text-gray-700 hover:text-purple-600 transition">
              Artistas
            </a>
            <a href="#acerca" className="text-gray-700 hover:text-purple-600 transition">
              Acerca de
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user && userProfile ? (
              <div className="flex items-center space-x-3">
                <span className="hidden sm:inline text-sm text-gray-600 font-medium">
                  {getUserTypeLabel()}
                </span>
                
                {isArtist && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Upload}
                    onClick={onOpenUploadModal}
                    className="hidden sm:flex"
                  >
                    Subir Obra
                  </Button>
                )}
                
                <Button
                  variant="secondary"
                  size="sm"
                  icon={LogOut}
                  onClick={handleSignOut}
                >
                  <span className="hidden sm:inline">Salir</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                icon={User}
                onClick={onOpenAuthModal}
              >
                Iniciar Sesión
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-purple-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2 border-t border-gray-200 pt-4">
            <a 
              href="#inicio" 
              className="block py-2 text-gray-700 hover:text-purple-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </a>
            <a 
              href="#subastas" 
              className="block py-2 text-gray-700 hover:text-purple-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Subastas
            </a>
            <a 
              href="#artistas" 
              className="block py-2 text-gray-700 hover:text-purple-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Artistas
            </a>
            <a 
              href="#acerca" 
              className="block py-2 text-gray-700 hover:text-purple-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Acerca de
            </a>
            
            {isArtist && (
              <button
                onClick={() => {
                  onOpenUploadModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 text-purple-600 font-medium"
              >
                Subir Obra
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;