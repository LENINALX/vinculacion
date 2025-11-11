import React, { useState, useEffect } from 'react';
import { Search, Star } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import ArtworkFilters from '../components/artworks/ArtworkFilters';
import ArtworkGrid from '../components/artworks/ArtworkGrid';
import BidModal from '../components/modals/BidModal';
import PaymentModal from '../components/modals/PaymentModal';
import PasswordResetModal from '../components/modals/PasswordResetModal';
import { useArtworks } from '../hooks/useArtworks';
import { artworkService } from '../services/artworkService';
import { supabase } from '../config/supabase';
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

  const [showBidModal, setShowBidModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');
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

  useEffect(() => {
    const url = new URL(window.location.href);
    const hash = window.location.hash;
    const hasRecoveryQuery = url.searchParams.get('recovery') === '1';
    const hasRecoveryHash = hash?.includes('type=recovery');

    if (!hasRecoveryQuery && !hasRecoveryHash) return;

    const ensureSession = async () => {
      setRecoveryError('');
      try {
        const params = new URLSearchParams(hash.replace('#', ''));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          if (error) {
            throw new Error(error.message || 'No se pudo preparar la sesión de recuperación.');
          }
        } else {
          const { data, error } = await supabase.auth.getSession();
          if (error || !data.session) {
            throw new Error('No se encontró una sesión de recuperación válida. Abre el enlace desde tu correo.');
          }
        }
        setShowRecoveryModal(true);
      } catch (err) {
        setRecoveryError(err.message);
        setShowRecoveryModal(true);
      }
    };

    ensureSession();
  }, []);

  const handleCloseRecoveryModal = () => {
    setShowRecoveryModal(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('recovery');
    const searchString = url.searchParams.toString();
    const newPath = `${url.pathname}${searchString ? `?${searchString}` : ''}`;
    window.history.replaceState(null, '', newPath);
  };

  return (
    <PageLayout onUploadSuccess={refreshArtworks}>
      <div className="bg-[#FFFADA]">
      {/* Hero Section */}
      <section
        id="inicio"
        className="bg-gradient-to-r from-[#811714] via-[#AE191A] to-[#811714] text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            Descubre Arte Único
          </h2>
          <p className="text-xl mb-8 text-black">
            Participa en subastas de obras originales de artistas talentosos
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Buscar obras o artistas..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-6 py-4 pr-12 rounded-full text-black placeholder:text-black focus:outline-none focus:ring-4 focus:ring-[#AE191A]/40 shadow-lg"
            />
            <Search className="absolute right-4 top-4 text-black" />
          </div>
        </div>
      </section>

      {/* Subastas Section */}
      <section id="subastas" className="bg-[#FFFADA] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center">
            <p className="text-sm uppercase tracking-widest text-black font-semibold mb-2">
              Subastas activas
            </p>
            <h2 className="text-3xl font-bold text-black">Explora obras disponibles</h2>
            <p className="text-black mt-2">
              Filtra por tipo, técnica o busca directamente por artista o nombre de la obra.
            </p>
          </div>

          <ArtworkFilters 
            filters={filters}
            onFilterChange={updateFilters}
          />

          {filteredFeatured.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <h3 className="text-2xl font-bold text-black">Obras Destacadas</h3>
              </div>
              <ArtworkGrid
                artworks={filteredFeatured}
                loading={loading}
                onBid={handleBidClick}
                onDelete={isAdmin ? handleDeleteArtwork : undefined}
                onToggleFeatured={isAdmin ? handleToggleFeatured : undefined}
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-black">
                {searchTerm ? 'Resultados de Búsqueda' : 'Todas las Obras'}
              </h3>
              <p className="text-sm text-black">
                {filteredArtworks.length} obra{filteredArtworks.length === 1 ? '' : 's'} disponible{filteredArtworks.length === 1 ? '' : 's'}
              </p>
            </div>
            <ArtworkGrid
              artworks={filteredArtworks}
              loading={loading}
              emptyMessage={searchTerm ? "No se encontraron obras con ese criterio" : "No hay obras disponibles"}
              onBid={handleBidClick}
              onDelete={isAdmin ? handleDeleteArtwork : undefined}
              onToggleFeatured={isAdmin ? handleToggleFeatured : undefined}
            />
          </div>
        </div>
      </section>

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
      <PasswordResetModal
        isOpen={showRecoveryModal}
        onClose={handleCloseRecoveryModal}
        initialError={recoveryError}
      />
      </div>
    </PageLayout>
  );
};

export default Home;
