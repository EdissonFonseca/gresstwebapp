import { useRef, useState } from 'react';
import { useLogin } from '../hooks';
import logoRegister from '@shared/assets/images/Logo sin letras.png';
import './LoginPage.css';

const APP_VERSION = '2.0-QA';

/** Fallback icon when logo image fails to load. */
function RegisterIconFallback() {
  return (
    <svg
      className="login-card__register-logo login-card__register-logo--fallback"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path fill="#4285F4" d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
      <path fill="#34A853" d="M12 2v10l10-5V7L12 2z" />
      <path fill="#FBBC05" d="M2 7l10 5 10-5-10-5L2 7z" />
    </svg>
  );
}

/** Logo in footer (Logo sin letras from shared assets). */
function RegisterLogo() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <RegisterIconFallback />;
  }

  return (
    <img
      src={logoRegister}
      alt=""
      className="login-card__register-logo"
      width={32}
      height={32}
      aria-hidden
      onError={() => setFailed(true)}
    />
  );
}

export function LoginPage() {
  const { submit, isLoading, error, clearError } = useLogin();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const username = usernameRef.current?.value ?? '';
    const password = passwordRef.current?.value ?? '';
    submit(username, password);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <header className="login-card__header">
          <h1 className="login-card__title">Gestor</h1>
          <p className="login-card__version">Versión {APP_VERSION}</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <p className="login-card__error" role="alert">
              {error}
            </p>
          )}

          <div className="login-form__group">
            <label htmlFor="login-username" className="login-form__label">
              Usuario o correo
            </label>
            <input
              ref={usernameRef}
              id="login-username"
              type="text"
              autoComplete="username"
              className="login-form__input"
              placeholder="Usuario o correo"
              disabled={isLoading}
            />
          </div>

          <div className="login-form__group">
            <label htmlFor="login-password" className="login-form__label">
              Clave
            </label>
            <input
              ref={passwordRef}
              id="login-password"
              type="password"
              autoComplete="current-password"
              className="login-form__input"
              placeholder="Clave"
              disabled={isLoading}
            />
            <a href="/forgot-password" className="login-form__forgot">
              Olvidó su clave?
            </a>
          </div>

          <button
            type="submit"
            className="login-form__submit"
            disabled={isLoading}
          >
            {isLoading ? 'Ingresando…' : 'INGRESAR'}
          </button>
        </form>

        <div className="login-card__register">
          <RegisterLogo />
          <p className="login-card__register-text">
            No tiene una cuenta? <a href="/register">Regístrese ahora</a>
          </p>
        </div>
      </div>
    </div>
  );
}
