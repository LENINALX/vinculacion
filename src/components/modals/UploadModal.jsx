import { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import Modal from './Modal';
import Input, { TextArea, Select } from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { artworkService } from '../../services/artworkService';

const UploadModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    artistCedula: '',
    artworkType: 'Pintura',
    technique: '',
    initialPrice: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('La imagen no debe superar los 5MB');
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.image) {
        setError('Por favor selecciona una imagen');
        setLoading(false);
        return;
      }

      const artworkData = {
        ...formData,
        artistId: user.id
      };

      const { error } = await artworkService.createArtwork(
        artworkData,
        formData.image
      );

      if (error) throw error;

      alert('¡Obra publicada exitosamente!');
      onClose();
      resetForm();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Error al publicar la obra');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      artistCedula: '',
      artworkType: 'Pintura',
      technique: '',
      initialPrice: '',
      image: null
    });
    setImagePreview(null);
    setError('');
  };

  const artworkTypeOptions = [
    { value: 'Pintura', label: 'Pintura' },
    { value: 'Escultura', label: 'Escultura' },
    { value: 'Fotografía', label: 'Fotografía' },
    { value: 'Arte Digital', label: 'Arte Digital' },
    { value: 'Otros', label: 'Otros' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Subir Nueva Obra"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="Título de la Obra"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ej: Atardecer en la Montaña"
          required
        />

        <Input
          label="Cédula"
          type="text"
          name="artistCedula"
          value={formData.artistCedula}
          onChange={handleChange}
          placeholder="0123456789"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tipo de Obra"
            name="artworkType"
            value={formData.artworkType}
            onChange={handleChange}
            options={artworkTypeOptions}
            required
          />

          <Input
            label="Técnica Utilizada"
            type="text"
            name="technique"
            value={formData.technique}
            onChange={handleChange}
            placeholder="Ej: Óleo sobre lienzo"
            required
          />
        </div>

        <TextArea
          label="Descripción"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe tu obra..."
          rows={4}
          required
        />

        <Input
          label="Precio Inicial (USD)"
          type="number"
          name="initialPrice"
          value={formData.initialPrice}
          onChange={handleChange}
          placeholder="10.00"
          min="0"
          step="0.01"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Alto (cm)"
            name="height"
            type="number"
            value={formData.height}
            onChange={handleChange}
            placeholder="Ej: 50"
            required
          />

          <Input
            label="Ancho (cm)"
            name="width"
            type="number"
            value={formData.width}
            onChange={handleChange}
            placeholder="Ej: 70"
            required
          />
        </div>

        {/* Upload de imagen */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen de la Obra
            <span className="text-red-500 ml-1">*</span>
          </label>
          
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setFormData(prev => ({ ...prev, image: null }));
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click para subir</span> o arrastra y suelta
                </p>
                <p className="text-xs text-gray-500">PNG, JPG o JPEG (MAX. 5MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </label>
          )}
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            icon={Upload}
            disabled={loading}
          >
            {loading ? 'Publicando...' : 'Publicar Obra'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadModal;