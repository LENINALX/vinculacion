import React, { useEffect, useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Modal from './Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

const PasswordResetModal = ({ isOpen, onClose, initialError = '' }) => {
  const { updatePassword, signOut } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState({ type: initialError ? 'error' : '', message: initialError });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const verifySession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setStatus({
          type: 'error',
          message: 'No se encontró una sesión válida. Abre el enlace desde tu correo para restablecer tu contraseña.'
        });
      }
    };

    setStatus((prev) => prev.type ? prev : { type: '', message: '' });
    verifySession();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setStatus({
        type: 'error',
        message: 'Tu enlace de recuperación expiró o ya fue usado. Solicita uno nuevo.'
      });
      return;
    }

    if (newPassword.length < 7) {
      setStatus({ type: 'error', message: 'La contraseña debe tener al menos 7 caracteres.' });
      return;
    }

    if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setStatus({ type: 'error', message: 'Incluye mínimo una mayúscula y un número.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'Las contraseñas no coinciden.' });
      return;
    }

    setLoading(true);
    try {
      const { success, error } = await updatePassword(newPassword);
      if (!success) {
        setStatus({ type: 'error', message: error || 'No se pudo actualizar la contraseña.' });
        setLoading(false);
        return;
      }

      setStatus({ type: 'success', message: 'Contraseña actualizada correctamente.' });
      setNewPassword('');
      setConfirmPassword('');
      await signOut({ silent: true });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Ocurrió un error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva contraseña"
      size="md"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <p className="text-sm text-black">
          Crea una contraseña segura. Necesitas escribirla dos veces para confirmarla.
        </p>

        {status.message && (
          <div
            className={`px-4 py-3 rounded-lg text-sm ${
              status.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {status.message}
          </div>
        )}

        <Input
          label="Nueva contraseña"
          type={showPassword ? 'text' : 'password'}
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
          icon={Lock}
          required
          rightElement={
            <button
              type="button"
              className="text-black hover:text-black"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
        />

        <Input
          label="Confirma tu contraseña"
          type={showConfirm ? 'text' : 'password'}
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          icon={Lock}
          required
          rightElement={
            <button
              type="button"
              className="text-black hover:text-black"
              onClick={() => setShowConfirm((prev) => !prev)}
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Actualizar contraseña'}
        </Button>
      </form>
    </Modal>
  );
};

export default PasswordResetModal;
