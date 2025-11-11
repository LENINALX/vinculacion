import React, { useState } from 'react';
import { CreditCard, Mail, Phone, CheckCircle } from 'lucide-react';
import Modal from './Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { bidService } from '../../services/bidService';

const PaymentModal = ({ isOpen, onClose, artwork, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validar tarjeta
      if (formData.cardNumber.length < 13 || formData.cardNumber.length > 19) {
        setError('Número de tarjeta inválido');
        setLoading(false);
        return;
      }

      // Guardar método de pago
      const { error: paymentError } = await bidService.savePaymentMethod({
        userId: user.id,
        cardNumber: formData.cardNumber,
        email: formData.email,
        phone: formData.phone
      });

      if (paymentError) throw paymentError;

      // Crear puja
      const { error: bidError } = await bidService.createBid({
        artworkId: artwork.id,
        userId: user.id,
        bidAmount: artwork.min_next_bid
      });

      if (bidError) throw bidError;

      alert('¡Puja realizada con éxito!');
      onClose();
      resetForm();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Error al procesar la puja');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      cardNumber: '',
      email: '',
      phone: ''
    });
    setError('');
  };

  if (!artwork) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Datos de Pago y Contacto"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Información Segura</p>
              <p>Las pujas se incrementan de $1 en $1 dólar.</p> 
              <p>Tus datos de pago están protegidos. Solo guardamos los últimos 4 dígitos de tu tarjeta.</p>
            </div>
          </div>
        </div>

        <Input
          label="Número de Tarjeta"
          type="text"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          icon={CreditCard}
          maxLength="19"
          required
        />

        <Input
          label="Correo Electrónico"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="correo@ejemplo.com"
          icon={Mail}
          required
        />

        <Input
          label="Teléfono de Contacto"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+593 99 123 4567"
          icon={Phone}
          required
        />

        {/* Resumen de puja */}
        <div className="bg-gradient-to-br from-[#AE191A0F] to-[#81171414] rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-black mb-4">Resumen de la Puja</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-black">Obra:</span>
              <span className="font-semibold text-black">{artwork.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Puja actual:</span>
              <span className="font-semibold text-black">
                ${artwork.current_bid?.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-[#AE191A30] pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-black font-semibold">Tu puja:</span>
                <span className="text-2xl font-bold text-black">
                  ${artwork.min_next_bid?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
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
            variant="success"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Confirmar Puja'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal;
