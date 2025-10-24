import { createClient } from '@supabase/supabase-js';

// IMPORTANTE: Reemplaza estos valores con tus credenciales de Supabase
// Las puedes encontrar en: Supabase Dashboard -> Settings -> API
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://eatgleorvknntjkhumwo.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhdGdsZW9ydmtubnRqa2h1bXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzI4OTcsImV4cCI6MjA3NjY0ODg5N30.gZdDj3hGhWH-BViWGyrfpQMyb3CtieZoJUvI1wKkUh8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Configuración del bucket de storage para imágenes
export const STORAGE_BUCKET = 'artworks';

// Helper para obtener URL pública de una imagen
export const getPublicImageUrl = (path) => {
  if (!path) return null;
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

// Helper para subir imagen
export const uploadImage = async (file, folder = 'artworks') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    
    return data.path;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export default supabase;