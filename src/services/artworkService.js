import { supabase } from '../config/supabase';
import { uploadImage, getPublicImageUrl } from '../config/supabase';

export const artworkService = {
  // Obtener todas las obras activas
  async getArtworks(filters = {}) {
    try {
      let query = supabase
        .from('artworks')
        .select(`
          *,
          artist:users!artworks_artist_id_fkey(id, full_name, email)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters.type && filters.type !== 'all') {
        query = query.eq('artwork_type', filters.type);
      }

      if (filters.technique && filters.technique !== 'all') {
        query = query.ilike('technique', `%${filters.technique}%`);
      }

      if (filters.featured) {
        query = query.eq('featured', true);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error getting artworks:', error);
      return { data: null, error };
    }
  },

  // Obtener una obra por ID
  async getArtworkById(id) {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select(`
          *,
          artist:users!artworks_artist_id_fkey(id, full_name, email, phone),
          bids(id, bid_amount, created_at, user:users(full_name))
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error getting artwork:', error);
      return { data: null, error };
    }
  },

  // Crear nueva obra
  async createArtwork(artworkData, imageFile) {
    try {
      // Subir imagen
      let imagePath = null;
      if (imageFile) {
        imagePath = await uploadImage(imageFile, 'artworks');
      }

      // Crear obra
      const { data, error } = await supabase
        .from('artworks')
        .insert([{
          title: artworkData.title,
          description: artworkData.description,
          artist_id: artworkData.artistId,
          artist_cedula: artworkData.artistCedula,
          artwork_type: artworkData.artworkType,
          technique: artworkData.technique,
          initial_price: parseFloat(artworkData.initialPrice),
          current_bid: parseFloat(artworkData.initialPrice),
          min_next_bid: parseFloat(artworkData.initialPrice) + 100,
          image_url: imagePath,
          status: 'active',
          featured: false
        }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating artwork:', error);
      return { data: null, error };
    }
  },

  // Actualizar obra
  async updateArtwork(id, updates) {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating artwork:', error);
      return { data: null, error };
    }
  },

  // Eliminar obra (soft delete)
  async deleteArtwork(id) {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .update({ status: 'removed' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting artwork:', error);
      return { data: null, error };
    }
  },

  // Destacar/quitar destacado
  async toggleFeatured(id, currentFeatured) {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .update({ featured: !currentFeatured })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error toggling featured:', error);
      return { data: null, error };
    }
  },

  // Obtener obras de un artista
  async getArtworksByArtist(artistId) {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('artist_id', artistId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error getting artist artworks:', error);
      return { data: null, error };
    }
  }
};

export default artworkService;