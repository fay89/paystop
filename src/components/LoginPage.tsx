import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sendMagicLink } from '../lib/firebase';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.includes('@')) { setError('Introduce un email válido.'); return; }

    setLoading(true);
    try {
      await sendMagicLink(email);
      setSuccess(true);
    } catch (err: unknown) {
      console.error("Magic link error:", err);
      setError('Error al enviar el enlace. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background glows */}
      <div className="login-glow login-glow-1" />
      <div className="login-glow login-glow-2" />

      <div className="login-card">
        {/* Logo & Brand */}
        <div className="login-brand">
          <div className="login-logo-ring">
            <img src="/logo.png" alt="PayStop Logo" className="login-logo-img" />
          </div>
          <h1 className="login-title">
            Pay<span className="login-title-accent">Stop</span>
          </h1>
          <p className="login-tagline">Controla tu dinero fantasma</p>
        </div>

        {success ? (
          <div className="flex flex-col items-center text-center py-6 gap-4 animate-fade-in" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <CheckCircle2 size={48} className="text-[var(--brand-green)]" style={{ color: 'var(--brand-green)' }} />
            <h2 className="text-xl font-medium text-white" style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 500 }}>¡Enlace enviado!</h2>
            <p className="text-gray-400 text-sm" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              Hemos enviado un enlace mágico a <strong style={{ color: '#fff' }}>{email}</strong>. 
              <br/><br/>
              Haz clic en él para entrar directamente a la app sin contraseña.
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-4 text-sm text-[var(--brand-green)] hover:underline"
              style={{ marginTop: '1rem', color: 'var(--brand-green)' }}
            >
              Probar con otro correo
            </button>
          </div>
        ) : (
          <>
            <div className="login-divider" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
              <span>Entra sin contraseña</span>
            </div>

            <form onSubmit={handleEmailSubmit} className="login-form">
              <div className="login-field">
                <div className="login-input-wrap">
                  <Mail size={17} className="login-input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="login-input"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {error && <p className="login-error">{error}</p>}

              <button type="submit" disabled={loading} className="btn-login-submit">
                {loading ? (
                  <span className="login-spinner" />
                ) : (
                  <>
                    Recibir enlace mágico
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </>
        )}

        <p className="login-footer">
          Al continuar, aceptas los{' '}
          <span style={{ color: 'var(--brand-green)', cursor: 'pointer' }}>Términos de uso</span>
        </p>
      </div>
    </div>
  );
};
