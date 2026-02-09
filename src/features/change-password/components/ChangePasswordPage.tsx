import { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useChangePassword } from '../hooks';
import { getRequirementResults, getPasswordStrength } from '../utils';
import type { RequirementResult, PasswordStrength } from '../utils';
import { ROUTES } from '@core/routing';
import './ChangePasswordPage.css';

/**
 * Change password form. Uses type="password" for all fields, client-side validation,
 * real-time requirement checklist and strength meter. Accessible via User menu → Cambiar contraseña.
 */
export function ChangePasswordPage() {
  const { submit, isLoading, error, validation: serverValidation, success, clearState } = useChangePassword();
  const currentRef = useRef<HTMLInputElement>(null);
  const newRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const [requirementResults, setRequirementResults] = useState<RequirementResult[]>(() =>
    getRequirementResults('')
  );
  const [strength, setStrength] = useState<PasswordStrength>('empty');

  const updateNewPasswordFeedback = useCallback(() => {
    const value = newRef.current?.value ?? '';
    setRequirementResults(getRequirementResults(value));
    setStrength(getPasswordStrength(value));
  }, []);

  const handleNewPasswordChange = () => {
    updateNewPasswordFeedback();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const current = currentRef.current?.value ?? '';
    const newPwd = newRef.current?.value ?? '';
    const confirm = confirmRef.current?.value ?? '';

    const ok = await submit(current, newPwd, confirm);
    if (ok) {
      currentRef.current && (currentRef.current.value = '');
      newRef.current && (newRef.current.value = '');
      confirmRef.current && (confirmRef.current.value = '');
      setRequirementResults(getRequirementResults(''));
      setStrength('empty');
    }
  };

  const handleReset = () => {
    clearState();
    setRequirementResults(getRequirementResults(''));
    setStrength('empty');
    currentRef.current?.focus();
  };

  const strengthLabel: Record<PasswordStrength, string> = {
    empty: '',
    weak: 'Débil',
    medium: 'Media',
    strong: 'Fuerte',
  };

  return (
    <div className="change-password-page">
      <h1>Cambiar contraseña</h1>
      <p className="change-password-page__intro">
        Ingrese su contraseña actual y la nueva contraseña. La nueva contraseña debe cumplir los requisitos indicados.
      </p>

      {success && (
        <div className="change-password-page__success" role="alert">
          Contraseña actualizada correctamente. Puede cerrar esta página o continuar navegando.
        </div>
      )}

      {error && (
        <div className="change-password-page__error-block" role="alert">
          <p className="change-password-page__error">{error}</p>
          {serverValidation && (
            <div className="change-password-page__server-validation">
              <p className="change-password-page__server-validation-title">
                Server requirements (strength: {serverValidation.strength})
              </p>
              <ul className="change-password-requirements" aria-live="polite">
                {serverValidation.requirements.map((req) => (
                  <li
                    key={req.id}
                    className={`change-password-requirements__item ${req.met ? 'change-password-requirements__item--met' : ''}`}
                  >
                    <span className="change-password-requirements__icon" aria-hidden>
                      {req.met ? '✓' : '✗'}
                    </span>
                    {req.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <form
        className="change-password-form"
        onSubmit={handleSubmit}
        onReset={handleReset}
        noValidate
        aria-label="Change password form"
      >
        <div className="change-password-form__group">
          <label htmlFor="change-password-current" className="change-password-form__label">
            Contraseña actual
          </label>
          <input
            ref={currentRef}
            id="change-password-current"
            type="password"
            autoComplete="current-password"
            className="change-password-form__input"
            disabled={isLoading || success}
            required
            aria-required="true"
          />
        </div>

        <div className="change-password-form__group">
          <label htmlFor="change-password-new" className="change-password-form__label">
            Nueva contraseña
          </label>
          <input
            ref={newRef}
            id="change-password-new"
            type="password"
            autoComplete="new-password"
            className="change-password-form__input"
            disabled={isLoading || success}
            required
            maxLength={128}
            aria-required="true"
            aria-describedby="change-password-requirements change-password-strength"
            onChange={handleNewPasswordChange}
            onBlur={handleNewPasswordChange}
          />
          <ul
            id="change-password-requirements"
            className="change-password-requirements"
            aria-live="polite"
          >
            {requirementResults.map((r) => (
                <li
                  key={r.id}
                  className={`change-password-requirements__item ${r.met ? 'change-password-requirements__item--met' : ''}`}
                >
                  <span className="change-password-requirements__icon" aria-hidden>
                    {r.met ? '✓' : '✗'}
                  </span>
                  {r.label}
                </li>
            ))}
          </ul>
          {strength !== 'empty' && (
            <div
              id="change-password-strength"
              className={`change-password-strength change-password-strength--${strength}`}
              role="status"
              aria-label={`Fortaleza: ${strengthLabel[strength]}`}
            >
              <span className="change-password-strength__bar" />
              <span className="change-password-strength__label">{strengthLabel[strength]}</span>
            </div>
          )}
        </div>

        <div className="change-password-form__group">
          <label htmlFor="change-password-confirm" className="change-password-form__label">
            Confirmar nueva contraseña
          </label>
          <input
            ref={confirmRef}
            id="change-password-confirm"
            type="password"
            autoComplete="new-password"
            className="change-password-form__input"
            disabled={isLoading || success}
            required
            aria-required="true"
          />
        </div>

        <div className="change-password-form__actions">
          <button type="submit" disabled={isLoading || success}>
            {isLoading ? 'Guardando…' : 'Cambiar contraseña'}
          </button>
          {success ? (
            <Link to={ROUTES.userProfile} className="change-password-page__link">
              Ir a Mi perfil
            </Link>
          ) : (
            <button type="reset" disabled={isLoading}>
              Limpiar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
