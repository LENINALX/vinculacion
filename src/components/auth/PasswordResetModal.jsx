import React, { useState } from 'react';
import Modal from '../modals/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const PasswordResetModal = ({ isOpen, onClose }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const { success, error } = await resetPassword(email);
      if (!success) {
        setStatus({ type: 'error', message: error || 'No se pudo enviar el correo.' });
        return;
      }
      setStatus({
        type: 'success',
        message: 'Hemos enviado un correo con instrucciones para restablecer tu contraseña.'
      });
      setEmail('');
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
      title="Recuperar contraseña"
      size="md"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <p className="text-sm text-black">
          Ingresa el correo con el que te registraste. Te enviaremos un enlace para que puedas crear una nueva contraseña.
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
          label="Correo electrónico"
          type="email"
          name="resetEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          required
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar instrucciones'}
        </Button>
      </form>
    </Modal>
  );
};

export default PasswordResetModal;
