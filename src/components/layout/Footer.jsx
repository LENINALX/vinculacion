import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h2 className="text-2xl font-bold">SubastArte</h2>
            </div>
            <p className="text-gray-400 mb-4">
              La plataforma líder en subastas de arte digital. Conectamos artistas talentosos con coleccionistas apasionados.
            </p>
            <div className="flex space-x-4">
              <a href="www.facebook.com" className="text-gray-400 hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="www.instagram.com" className="text-gray-400 hover:text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="www.x.com" className="text-gray-400 hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#inicio" className="text-gray-400 hover:text-white transition">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#subastas" className="text-gray-400 hover:text-white transition">
                  Subastas
                </a>
              </li>
              <li>
                <a href="#artistas" className="text-gray-400 hover:text-white transition">
                  Artistas
                </a>
              </li>
              <li>
                <a href="#acerca" className="text-gray-400 hover:text-white transition">
                  Acerca de
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>info@subastarte.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+593 99 123 4567</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Quito, Ecuador</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SubastArte. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;