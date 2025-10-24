import React from 'react';
import { Star, Eye, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import { getPublicImageUrl } from '../../config/supabase';

const ArtworkCard = ({ artwork, onBid, onDelete, onToggleFeatured, onEdit }) => {
  const { isAdmin } = useAuth();

  const imageUrl = artwork.image_url 
    ? getPublicImageUrl(artwork.image_url) 
    : 'https://via.placeholder.com/400x300?text=Sin+Imagen';

  const artistName = artwork.artist?.full_name || 'Artista Desconocido';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      {/* Imagen */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={artwork.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+No+Disponible';
          }}
        />
        
        {/* Badge de destacado */}
        {artwork.featured && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
            <Star className="w-4 h-4 fill-white" />
            <span>Destacado</span>
          </div>
        )}
        
        {/* Overlay con título y artista */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-bold text-lg line-clamp-1">
            {artwork.title}
          </h3>
          <p className="text-white/90 text-sm">
            {artistName}
          </p>
        </div>
      </div>
      
      {/* Contenido */}
      <div className="p-4">
        {/* Tipo y técnica */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 font-medium">
            {artwork.artwork_type}
          </span>
          <span className="text-sm text-gray-500">
            {artwork.technique}
          </span>
        </div>
        
        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {artwork.description}
        </p>
        
        {/* Información de puja */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Puja actual</p>
              <p className="text-2xl font-bold text-purple-600">
                ${artwork.current_bid?.toFixed(2) || artwork.initial_price?.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Siguiente puja</p>
              <p className="text-lg font-semibold text-gray-700">
                ${artwork.min_next_bid?.toFixed(2)}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {artwork.total_bids || 0} pujas realizadas
          </p>
        </div>
        
        {/* Botones de acción */}
        {isAdmin ? (
          <div className="flex space-x-2">
            <Button
              variant={artwork.featured ? 'secondary' : 'outline'}
              size="sm"
              icon={Star}
              onClick={() => onToggleFeatured(artwork.id, artwork.featured)}
              className="flex-1"
            >
              {artwork.featured ? 'Quitar' : 'Destacar'}
            </Button>
            <button
              onClick={() => onEdit && onEdit(artwork)}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(artwork.id)}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Button
            variant="primary"
            fullWidth
            icon={Eye}
            onClick={() => onBid(artwork)}
          >
            Ver y Pujar
          </Button>
        )}
      </div>
    </div>
  );
};

export default ArtworkCard;