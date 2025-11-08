import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Phone, CreditCard, Eye, EyeOff } from 'lucide-react';
import Modal from './Modal';
import Input, { Select } from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

// Modal para iniciar sesión, registrarse o solicitar recuperación de contraseña
const AuthModal = ({ isOpen, onClose }) => {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'reset'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (mode === 'reset') {
        const { success, error } = await resetPassword(formData.email);
        if (!success) {
          setError(error || 'No se pudo enviar el correo de recuperación.');
          setLoading(false);
          return;
        }
        setSuccessMessage('Hemos enviado un enlace para restablecer tu contraseña.');
        setLoading(false);
        return;
      }

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
        alert('Registro exitoso. Revisa tu correo para confirmar la cuenta.');
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
    setSuccessMessage('');
    setShowPassword(false);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  const goToReset = () => {
    setMode('reset');
    setError('');
    setSuccessMessage('');
    setShowPassword(false);
  };

  const backToLogin = () => {
    setMode('login');
    setError('');
    setSuccessMessage('');
    setShowPassword(false);
  };

  const userTypeOptions = [
    { value: 'client', label: 'Cliente' },
    { value: 'artist', label: 'Artista' }
  ];

  const title = mode === 'login'
    ? 'Iniciar Sesión'
    : mode === 'register'
      ? 'Crear Cuenta'
      : 'Recuperar Contraseña';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {(error || successMessage) && (
          <div
            className={`px-4 py-3 rounded-lg ${
              error
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}
          >
            {error || successMessage}
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

        {mode !== 'reset' && (
          <Input
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={Lock}
            required
            rightElement={
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
          />
        )}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
        >
          {loading
            ? 'Procesando...'
            : mode === 'login'
              ? 'Iniciar Sesión'
              : mode === 'register'
                ? 'Registrarse'
                : 'Enviar instrucciones'}
        </Button>

        {mode === 'login' && (
          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={toggleMode}
              className="block w-full text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              ¿No tienes cuenta? Regístrate
            </button>
            <button
              type="button"
              onClick={goToReset}
              className="text-sm text-purple-500 hover:text-purple-600"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}

        {mode === 'register' && (
          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        )}

        {mode === 'reset' && (
          <div className="text-center">
            <button
              type="button"
              onClick={backToLogin}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Volver a iniciar sesión
            </button>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default AuthModal;
