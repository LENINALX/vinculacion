import React from 'react';
import { Filter } from 'lucide-react';
import { Select } from '../common/Input';

const ArtworkFilters = ({ filters, onFilterChange }) => {
  const artworkTypes = [
    { value: 'all', label: 'Todos' },
    { value: 'Pintura', label: 'Pintura' },
    { value: 'Escultura', label: 'Escultura' },
    { value: 'Fotografía', label: 'Fotografía' },
    { value: 'Arte Digital', label: 'Arte Digital' },
    { value: 'Otros', label: 'Otros' }
  ];

  const techniques = [
    { value: 'all', label: 'Todas' },
    { value: 'Óleo', label: 'Óleo' },
    { value: 'Acrílico', label: 'Acrílico' },
    { value: 'Acuarela', label: 'Acuarela' },
    { value: 'Bronce', label: 'Bronce' },
    { value: 'Mármol', label: 'Mármol' },
    { value: 'Digital', label: 'Digital' },
    { value: 'Fotografía', label: 'Fotografía' },
    { value: 'Otros', label: 'Otros' }
  ];

  const handleTypeChange = (e) => {
    onFilterChange({ type: e.target.value });
  };

  const handleTechniqueChange = (e) => {
    onFilterChange({ technique: e.target.value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-800">Filtros</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Tipo de Obra"
          name="type"
          value={filters.type || 'all'}
          onChange={handleTypeChange}
          options={artworkTypes}
        />
        
        <Select
          label="Técnica"
          name="technique"
          value={filters.technique || 'all'}
          onChange={handleTechniqueChange}
          options={techniques}
        />
      </div>
    </div>
  );
};

export default ArtworkFilters;