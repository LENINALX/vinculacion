import { supabase } from '../config/supabase';

export const bidService = {
  // Crear nueva puja
  async createBid(bidData) {
    try {
      const { artworkId, userId, bidAmount } = bidData;

      // Verificar que la puja sea válida
      const { data: artwork, error: artworkError } = await supabase
        .from('artworks')
        .select('min_next_bid, current_bid')
        .eq('id', artworkId)
        .single();

      if (artworkError) throw artworkError;

      if (bidAmount < artwork.min_next_bid) {
        throw new Error(`La puja mínima es $${artwork.min_next_bid}`);
      }

      // Crear la puja
      const { data, error } = await supabase
        .from('bids')
        .insert([{
          artwork_id: artworkId,
          user_id: userId,
          bid_amount: parseFloat(bidAmount)
        }])
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error creating bid:', error);
      return { data: null, error };
    }
  },

  // Obtener pujas de una obra
  async getBidsByArtwork(artworkId) {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          user:users(full_name, email)
        `)
        .eq('artwork_id', artworkId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error getting bids:', error);
      return { data: null, error };
    }
  },

  // Obtener pujas de un usuario
  async getBidsByUser(userId) {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          artwork:artworks(id, title, image_url, current_bid, status)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error getting user bids:', error);
      return { data: null, error };
    }
  },

  // Obtener la última puja de una obra
  async getLatestBid(artworkId) {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          user:users(full_name)
        `)
        .eq('artwork_id', artworkId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return { data, error: null };
    } catch (error) {
      console.error('Error getting latest bid:', error);
      return { data: null, error };
    }
  },

  // Guardar método de pago
  async savePaymentMethod(paymentData) {
    try {
      const { userId, cardNumber, email, phone } = paymentData;

      const { data, error } = await supabase
        .from('payment_methods')
        .insert([{
          user_id: userId,
          card_number_last4: cardNumber.slice(-4),
          email,
          phone
        }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error saving payment method:', error);
      return { data: null, error };
    }
  },

  // Obtener métodos de pago de un usuario
  async getPaymentMethods(userId) {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error getting payment methods:', error);
      return { data: null, error };
    }
  }
};

export default bidService;