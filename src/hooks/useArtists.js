import { useCallback, useEffect, useState } from 'react';
import { artistService } from '../services/artistService';

export const useArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadArtists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await artistService.getArtists();
      if (error) throw error;
      setArtists(data || []);
    } catch (err) {
      console.error('Error loading artists:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArtists();
  }, [loadArtists]);

  return {
    artists,
    loading,
    error,
    refreshArtists: loadArtists
  };
};

export default useArtists;
