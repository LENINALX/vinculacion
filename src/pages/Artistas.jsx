import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import ArtistGrid from '../components/artists/ArtistGrid';
import { useArtists } from '../hooks/useArtists';

const Artistas = () => {
  const { artists, loading, error } = useArtists();

  return (
    <PageLayout>
      <section className="bg-[#FFFADA] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-sm uppercase tracking-widest text-black font-semibold">
              Comunidad creativa
            </p>
            <h1 className="text-4xl font-bold text-black mt-2">Artistas registrados</h1>
            <p className="text-black mt-4">
              Descubre a los creadores que forman parte de SubastArte. Conoce su información de contacto
              y síguelos para estar al tanto de sus próximas subastas.
            </p>
          </div>

          <div className="flex justify-end mb-6">
            <p className="text-sm text-black">
              {artists.length} artista{artists.length === 1 ? '' : 's'} activo{artists.length === 1 ? '' : 's'}
            </p>
          </div>

          <ArtistGrid
            artists={artists}
            loading={loading}
            error={error}
          />
        </div>
      </section>
    </PageLayout>
  );
};

export default Artistas;
