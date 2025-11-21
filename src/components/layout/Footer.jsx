import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const quickLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Subastas', path: '/subastas' },
    { label: 'Artistas', path: '/artistas' },
    { label: 'Acerca de', path: '/acerca' }
  ];

  const handleNavigate = (path) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="bg-[#811714] text-[#F6E7D8] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/LOGO.png"
                alt="SubastArte"
                style={{ height: '60px', width: 'auto' }}
              />
            </div>
            <p className="text-[#F6E7D8] mb-4">
              La plataforma líder en subastas de arte digital. Conectamos artistas talentosos con coleccionistas apasionados.
            </p>
            <div className="flex space-x-4">
              <a href="www.facebook.com" className="text-[#F6E7D8] hover:text-[#FFE7BD] transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="www.instagram.com" className="text-[#F6E7D8] hover:text-[#FFE7BD] transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="www.x.com" className="text-[#F6E7D8] hover:text-[#FFE7BD] transition">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FFE7BD]">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <button
                    type="button"
                    onClick={() => handleNavigate(link.path)}
                    className="text-[#F6E7D8] hover:text-[#FFE7BD] transition"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FFE7BD]">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-[#F6E7D8]">
                <Mail className="w-4 h-4" />
                <span>info@subastarte.com</span>
              </li>
              <li className="flex items-center space-x-2 text-[#F6E7D8]">
                <Phone className="w-4 h-4" />
                <span>+593 99 123 4567</span>
              </li>
              <li className="flex items-center space-x-2 text-[#F6E7D8]">
                <MapPin className="w-4 h-4" />
                <span>Quito, Ecuador</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#AE191A] mt-8 pt-8 text-center text-[#F6E7D8]">
          <p>&copy; {new Date().getFullYear()} SubastArte. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
