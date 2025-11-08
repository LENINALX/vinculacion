import React from 'react';
import { Mail, Phone, Image as ImageIcon } from 'lucide-react';

const ArtistCard = ({ artist }) => {
  const initials = artist.full_name
    ? artist.full_name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AR';

  const avatar = artist.avatar_url || null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col space-y-4 border border-slate-100">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white font-semibold flex items-center justify-center text-lg">
          {avatar ? (
            <img
              src={avatar}
              alt={artist.full_name}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                e.target.src = '';
              }}
            />
          ) : (
            initials
          )}
        </div>
        <div>
          <p className="text-sm text-purple-500 font-semibold">Artista verificado</p>
          <h3 className="text-lg font-bold text-gray-900">{artist.full_name}</h3>
          {artist.artist_id && (
            <p className="text-xs text-gray-500">ID Artista: {artist.artist_id}</p>
          )}
        </div>
      </div>

      <div className="text-gray-600 text-sm">
        <p>{artist.bio || 'Este artista aún no ha compartido una biografía.'}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-purple-500" />
          <span>{artist.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-purple-500" />
          <span>{artist.phone || 'Sin teléfono registrado'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-4 h-4 text-purple-500" />
          <span>Obras subidas por este artista próximamente</span>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
