import { supabase } from '../config/supabase';

export const artistService = {
  async getArtists() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, phone, artist_id, avatar_url')
        .eq('user_type', 'artist')
        .order('full_name', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error getting artists:', error);
      return { data: null, error };
    }
  }
};

export default artistService;
