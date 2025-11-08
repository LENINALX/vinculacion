import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Phone, CreditCard, Eye, EyeOff } from 'lucide-react';
import Modal from './Modal';
import Input, { Select } from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' o 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    userType: 'client',
    phone: '',
    artistId: ''
  });

  const passwordRequirements = 'Mínimo 7 caracteres, incluye un número y una mayúscula.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/;
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone' || name === 'artistId') {
      if (value && !/^\d*$/.test(value)) {
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setFormErrors(prev => {
      if (!prev[name]) return prev;
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  const validateLogin = () => {
    const errors = {};
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Ingresa un correo válido.';
    }
    if (!formData.password) {
      errors.password = 'Ingresa tu contraseña.';
    }

    setFormErrors(errors);
    if (Object.keys(errors).length) {
      setError('Por favor corrige los campos resaltados.');
      return false;
    }
    return true;
  };

  const validateRegister = () => {
    const errors = {};
    const fullName = formData.fullName.trim();

    if (!fullName) {
      errors.fullName = 'Ingresa tu nombre completo.';
    } else if (!nameRegex.test(fullName)) {
      errors.fullName = 'Solo se permiten letras y espacios.';
    }

    if (formData.userType === 'artist') {
      const artistId = formData.artistId.trim();
      if (!artistId) {
        errors.artistId = 'Ingresa la cédula del artista.';
      } else if (!/^\d+$/.test(artistId)) {
        errors.artistId = 'La cédula solo debe contener números.';
      }
    }

    if (formData.phone && !/^\d{7,15}$/.test(formData.phone)) {
      errors.phone = 'Ingresa un teléfono válido (solo números).';
    }

    if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Ingresa un correo válido.';
    }

    if (!passwordRegex.test(formData.password)) {
      errors.password = 'La contraseña no cumple los requisitos.';
    }

    setFormErrors(errors);
    if (Object.keys(errors).length) {
      setError('Por favor corrige los campos resaltados.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const isValid = mode === 'login' ? validateLogin() : validateRegister();
    if (!isValid) {
      setLoading(false);
      return;
    }

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
    setFormErrors({});
    setShowPassword(false);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
    setShowPassword(false);
  };

  const userTypeOptions = [
    { value: 'client', label: 'Cliente' },
    { value: 'artist', label: 'Artista' }
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
              error={formErrors.fullName}
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
                inputMode="numeric"
                error={formErrors.artistId}
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
              inputMode="numeric"
              error={formErrors.phone}
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
          error={formErrors.email}
        />

        <Input
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          icon={Lock}
          required
          error={formErrors.password}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
        />

        {mode === 'register' && (
          <p className="text-xs text-gray-500 -mt-2">
            {passwordRequirements}
          </p>
        )}

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
