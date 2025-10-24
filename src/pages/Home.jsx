import React, { useState } from 'react';
import { Search, Star } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ArtworkFilters from '../components/artworks/ArtworkFilters';
import ArtworkGrid from '../components/artworks/ArtworkGrid';
import AuthModal from '../components/modals/AuthModal';
import UploadModal from '../components/modals/UploadModal';
import BidModal from '../components/modals/BidModal';
import PaymentModal from '../components/modals/PaymentModal';
import { useArtworks } from '../hooks/useArtworks';
import { artworkService } from '../services/artworkService';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    artworks, 
    featuredArtworks, 
    loading, 
    filters, 
    updateFilters, 
    refreshArtworks 
  } = useArtworks();

  // Estados de modales
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  // Filtrar artworks por búsqueda
  const filteredArtworks = artworks.filter(art => 
    art.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.artist?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFeatured = featuredArtworks.filter(art => 
    art.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.artist?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleBidClick = (artwork) => {
    setSelectedArtwork(artwork);
    setShowBidModal(true);
  };

  const handleProceedToBid = (artwork) => {
    setShowBidModal(false);
    setSelectedArtwork(artwork);
    setShowPaymentModal(true);
  };

  const handleDeleteArtwork = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta obra?')) return;

    const { error } = await artworkService.deleteArtwork(id);
    if (error) {
      alert('Error al eliminar: ' + error.message);
      return;
    }

    alert('Obra eliminada exitosamente');
    refreshArtworks();
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    const { error } = await artworkService.toggleFeatured(id, currentFeatured);
    if (error) {
      alert('Error al actualizar: ' + error.message);
      return;
    }

    refreshArtworks();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <Header
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenUploadModal={() => setShowUploadModal(true)}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Descubre Arte Único
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Participa en subastas de obras originales de artistas talentosos
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Buscar obras o artistas..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-6 py-4 pr-12 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg"
            />
            <Search className="absolute right-4 top-4 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ArtworkFilters 
          filters={filters}
          onFilterChange={updateFilters}
        />
      </section>

      {/* Featured Artworks */}
      {filteredFeatured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-2 mb-6">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-800">Obras Destacadas</h2>
          </div>
          <ArtworkGrid
            artworks={filteredFeatured}
            loading={loading}
            onBid={handleBidClick}
            onDelete={isAdmin ? handleDeleteArtwork : undefined}
            onToggleFeatured={isAdmin ? handleToggleFeatured : undefined}
          />
        </section>
      )}

      {/* All Artworks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {searchTerm ? 'Resultados de Búsqueda' : 'Todas las Obras'}
        </h2>
        <ArtworkGrid
          artworks={filteredArtworks}
          loading={loading}
          emptyMessage={searchTerm ? "No se encontraron obras con ese criterio" : "No hay obras disponibles"}
          onBid={handleBidClick}
          onDelete={isAdmin ? handleDeleteArtwork : undefined}
          onToggleFeatured={isAdmin ? handleToggleFeatured : undefined}
        />
      </section>

      {/* Footer */}
      <Footer />

      {/* Modales */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={refreshArtworks}
      />

      <BidModal
        isOpen={showBidModal}
        onClose={() => setShowBidModal(false)}
        artwork={selectedArtwork}
        onProceedToBid={handleProceedToBid}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        artwork={selectedArtwork}
        onSuccess={refreshArtworks}
      />
    </div>
  );
};

export default Home;