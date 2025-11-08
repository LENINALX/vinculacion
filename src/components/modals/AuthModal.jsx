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
  const [showConfirmRegister, setShowConfirmRegister] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    userType: 'client',
    phone: '',
    artistId: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccessMessage('');
    setFormErrors((prev) => {
      if (!prev[name]) return prev;
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  const nameRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?\d{9,15}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{7,}$/;

  const validateRegister = () => {
    const errors = {};
    const name = formData.fullName.trim();
    if (!name || !nameRegex.test(name)) {
      errors.fullName = 'Ingresa nombre y apellido (solo letras).';
    }

    const phone = formData.phone.trim();
    if (!phone) {
      errors.phone = 'El teléfono es obligatorio.';
    } else if (!phoneRegex.test(phone)) {
      errors.phone = 'Teléfono inválido. Solo dígitos (puede iniciar con +).';
    }

    if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Ingresa un correo válido.';
    }

    if (!passwordRegex.test(formData.password)) {
      errors.password = 'La contraseña requiere una mayúscula, un número y ≥7 caracteres.';
    }

    if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    if (formData.userType === 'artist') {
      if (!formData.artistId.trim()) {
        errors.artistId = 'La cédula es obligatoria para artistas.';
      }
    }

    setFormErrors(errors);
    if (Object.keys(errors).length) {
      setError('Corrige los campos marcados antes de continuar.');
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    const errors = {};
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Ingresa un correo válido.';
    }
    if (!formData.password.trim()) {
      errors.password = 'Ingresa tu contraseña.';
    }
    setFormErrors(errors);
    if (Object.keys(errors).length) {
      setError('Completa los campos requeridos.');
      return false;
    }
    return true;
  };

  const validateReset = () => {
    if (!emailRegex.test(formData.email.trim())) {
      setFormErrors({ email: 'Ingresa un correo válido.' });
      setError('Completa los campos requeridos.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (mode === 'reset') {
        if (!validateReset()) {
          setLoading(false);
          return;
        }
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
        if (!validateLogin()) {
          setLoading(false);
          return;
        }
        const { success, error } = await signIn(formData.email, formData.password);
        if (!success) {
          setError(error || 'Error al iniciar sesión');
          setFormErrors({
            email: 'Revisa tu correo.',
            password: 'Verifica tu contraseña.'
          });
          setLoading(false);
          return;
        }
      } else {
        if (!validateRegister()) {
          setLoading(false);
          return;
        }
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
      artistId: '',
      confirmPassword: ''
    });
    setError('');
    setSuccessMessage('');
    setShowPassword(false);
    setFormErrors({});
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
    setShowConfirmRegister(false);
    setFormErrors({});
  };

  const backToLogin = () => {
    setMode('login');
    setError('');
    setSuccessMessage('');
    setShowPassword(false);
    setShowConfirmRegister(false);
    setFormErrors({});
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
              required
              error={formErrors.phone}
            />

            <Input
              label="Confirmar contraseña"
              type={showConfirmRegister ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              icon={Lock}
              required
              error={formErrors.confirmPassword}
              rightElement={
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmRegister((prev) => !prev)}
                >
                  {showConfirmRegister ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
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
            error={formErrors.password}
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
        {mode === 'register' && (
          <p className="text-xs text-gray-500 -mt-3">
            La contraseña debe tener al menos 7 caracteres, una mayúscula y un número.
          </p>
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
