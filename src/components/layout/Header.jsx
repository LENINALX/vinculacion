import React, { useState } from 'react';
import { Menu, X, Upload, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const navItems = [
  { path: '/', label: 'Inicio' },
  { path: '/subastas', label: 'Subastas' },
  { path: '/artistas', label: 'Artistas' },
  { path: '/acerca', label: 'Acerca de' }
];

const Header = ({ onOpenAuthModal, onOpenUploadModal }) => {
  const { user, userProfile, signOut, isArtist } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(path);
    }
    setMobileMenuOpen(false);
  };

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
    <header className="bg-[#FFFADA] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavigation('/')}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-10 h-10 bg-[#AE191A] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-2xl font-bold text-[#AE191A]">
              SubastArte
            </h1>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavigation(item.path)}
                className={`text-black hover:text-[#AE191A] transition ${location.pathname === item.path ? 'font-semibold text-[#AE191A]' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user && userProfile ? (
              <div className="flex items-center space-x-3">
                <span className="hidden sm:inline text-sm text-black font-medium">
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
              className="md:hidden p-2 text-black hover:text-[#AE191A]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2 border-t border-gray-200 pt-4">
            {navItems.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavigation(item.path)}
                className="block w-full text-left py-2 text-black hover:text-[#AE191A]"
              >
                {item.label}
              </button>
            ))}
            
            {isArtist && (
              <button
                onClick={() => {
                  onOpenUploadModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 text-[#AE191A] font-medium"
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
