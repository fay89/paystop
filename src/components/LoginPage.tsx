import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { auth, resetPassword } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    if (!email.includes('@')) { setError('Introduce un email válido.'); return; }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }

    setLoading(true);
    try {
      if (mode === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(cred.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Email o contraseña incorrectos.');
      } else if (code === 'auth/email-already-in-use') {
        setError('Este email ya está registrado. Entra con tus credenciales.');
      } else {
        setError('Error al procesar la solicitud. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setResetMessage('');
    if (!email.includes('@')) {
      setError('Escribe tu correo arriba y presiona "¿Olvidaste tu contraseña?" para poder enviarte el enlace.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setResetMessage('Te hemos enviado un enlace para restablecer tu contraseña. Revisa tu correo.');
    } catch (err: unknown) {
      console.error(err);
      setError('No pudimos enviar el correo de recuperación. Revisa que el email sea correcto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-glow login-glow-1" />
      <div className="login-glow login-glow-2" />

      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo-ring">
            <img src="/logo.png" alt="PayStop Logo" className="login-logo-img" />
          </div>
          <h1 className="login-title">
            Pay<span className="login-title-accent">Stop</span>
          </h1>
          <p className="login-tagline">Controla tu dinero fantasma</p>
        </div>

        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); setResetMessage(''); }}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            className={`login-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); setResetMessage(''); }}
          >
            Crear cuenta
          </button>
        </div>

        <form onSubmit={handleEmailSubmit} className="login-form">
          {mode === 'register' && (
            <div className="login-field">
              <div className="login-input-wrap">
                <span className="login-input-icon">👤</span>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="login-input"
                  autoComplete="name"
                />
              </div>
            </div>
          )}

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

          <div className="login-field">
            <div className="login-input-wrap">
              <Lock size={17} className="login-input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="login-input"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                className="login-eye"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.3rem', marginBottom: '1rem' }}>
              <button 
                type="button" 
                onClick={handleResetPassword} 
                style={{ fontSize: '0.8rem', color: '#9ca3af', cursor: 'pointer', background: 'none', border: 'none', transition: 'color 0.2s' }}
                disabled={loading}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          {error && <p className="login-error">{error}</p>}
          {resetMessage && <p style={{ color: 'var(--brand-green)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem' }}>{resetMessage}</p>}

          <button type="submit" disabled={loading} className="btn-login-submit">
            {loading ? (
              <span className="login-spinner" />
            ) : (
              <>
                {mode === 'login' ? 'Entrar con tu Email' : 'Completar registro'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="login-footer">
          Al continuar, aceptas los{' '}
          <span style={{ color: 'var(--brand-green)', cursor: 'pointer' }}>Términos de uso</span>
        </p>
      </div>
    </div>
  );
};
