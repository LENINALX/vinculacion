import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Phone, CreditCard } from 'lucide-react';
import Modal from './Modal';
import Input, { Select } from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' o 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    userType: 'client',
    phone: '',
    artistId: ''
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
      if (mode === 'login') {
        const { success, error } = await signIn(formData.email, formData.password);
        if (!success) {
          setError(error || 'Error al iniciar sesión');
          setLoading(false);
          return;
        }
      } else {
        const { success, error } = await signUp(formData);
        if (!success) {
          setError(error || 'Error al registrar usuario');
          setLoading(false);
          return;
        }
        alert('Registro exitoso! Por favor verifica tu correo electrónico.');
      }
      
      onClose();
      resetForm();
    } catch (err) {
      setError(err.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      userType: 'client',
      phone: '',
      artistId: ''
    });
    setError('');
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  const userTypeOptions = [
    { value: 'client', label: 'Cliente' },
    { value: 'artist', label: 'Artista' },
    { value: 'admin', label: 'Administrador' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {mode === 'register' && (
          <>
            <Input
              label="Nombre Completo"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Juan Pérez"
              icon={UserIcon}
              required
            />

            <Select
              label="Tipo de Usuario"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              options={userTypeOptions}
              required
            />

            {formData.userType === 'artist' && (
              <Input
                label="Cédula del Artista"
                type="text"
                name="artistId"
                value={formData.artistId}
                onChange={handleChange}
                placeholder="0123456789"
                icon={CreditCard}
                required
              />
            )}

            <Input
              label="Teléfono"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+593 99 123 4567"
              icon={Phone}
            />
          </>
        )}

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
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          icon={Lock}
          required
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Procesando...' : mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            {mode === 'login' 
              ? '¿No tienes cuenta? Regístrate' 
              : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AuthModal;