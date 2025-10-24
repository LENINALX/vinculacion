import { useState, useEffect, useCallback } from 'react';
import { artworkService } from '../services/artworkService';

export const useArtworks = (initialFilters = {}) => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const loadArtworks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await artworkService.getArtworks(filters);
      
      if (error) throw error;
      setArtworks(data || []);
    } catch (err) {
      console.error('Error loading artworks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadArtworks();
  }, [loadArtworks]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const refreshArtworks = () => {
    loadArtworks();
  };

  const featuredArtworks = artworks.filter(art => art.featured);

  return {
    artworks,
    featuredArtworks,
    loading,
    error,
    filters,
    updateFilters,
    refreshArtworks
  };
};

export default useArtworks;