import React from 'react';
import { Gavel, Share2} from 'lucide-react';
import Modal from './Modal';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { getPublicImageUrl } from '../../config/supabase';

const BidModal = ({ isOpen, onClose, artwork, onProceedToBid }) => {
  const { isAuthenticated, isClient } = useAuth();

  if (!artwork) return null;

  const imageUrl = artwork.image_url 
    ? getPublicImageUrl(artwork.image_url) 
    : 'https://via.placeholder.com/400x300?text=Sin+Imagen';

  const artistName = artwork.artist?.full_name || 'Artista Desconocido';

  const handleBidClick = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para pujar');
      onClose();
      return;
    }

    if (!isClient) {
      alert('Solo los clientes pueden realizar pujas');
      return;
    }

    onProceedToBid(artwork);
  };

  const handleShare =async () => {
    const shareurl= `${window.location.origin}/?obra=${artwork.id}`;
    const sharetext= `Mira esta obra:"${artwork.title}" por ${artistName} - $${artwork.current_bid} en ExpoSubasta. `;
    if (navigator.share) {
      try {
        await navigator.share({
          title: artwork.title,
          text: sharetext,
          url: shareurl,
        });
        console.log('Obra compartida exitosamente');
      } catch (error) {
        console.error('Error al compartir la obra:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareurl);
        alert('Enlace de la obra copiado al portapapeles');
      } catch (error) {
        console.error('Error al copiar el enlace:', error);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <div className="space-y-6">
        {/* Imagen */}
        <img
          src={imageUrl}
          alt={artwork.title}
          className="w-full h-80 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+No+Disponible';
          }}
        />

        {/* Título */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {artwork.title}
          </h2>
          <button
    onClick={handleShare}
    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
    title="Compartir obra"
          >
    <Share2 className="w-6 h-6" />
  </button>
          <p className="text-lg text-gray-600">
            por {artistName}
          </p>
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Tipo</p>
            <p className="text-base font-semibold text-gray-800">
              {artwork.artwork_type}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Técnica</p>
            <p className="text-base font-semibold text-gray-800">
              {artwork.technique}
            </p>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Descripción</p>
          <p className="text-gray-700 leading-relaxed">
            {artwork.description}
          </p>
        </div>

        {/* Información de puja */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Puja Actual</p>
              <p className="text-3xl font-bold text-purple-600">
                ${artwork.current_bid?.toFixed(2) || artwork.initial_price?.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Siguiente Puja Mínima</p>
              <p className="text-2xl font-bold text-gray-800">
                ${artwork.min_next_bid?.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {artwork.total_bids || 0} pujas realizadas
            </span>
            <span className="text-gray-600">
              Incremento: $1.00
            </span>
          </div>
        </div>

        {/* Botón de acción */}
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            fullWidth
            icon={Gavel}
            onClick={handleBidClick}
          >
            Realizar Puja
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BidModal;