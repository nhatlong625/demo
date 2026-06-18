import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/register.css';
import authService from '../../services/authService';

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [agreeError, setAgreeError] = useState('');
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    let hasError = false;
    setServerError('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setFullNameError('Full name is required');
      hasError = true;
    } else {
      setFullNameError('');
    }

    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!email.includes('@')) {
      setEmailError('Email is not valid');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (!agree) {
      setAgreeError('You must agree to the Terms and Privacy Policy');
      hasError = true;
    } else {
      setAgreeError('');
    }

    if (hasError) return;

    setLoading(true);
    try {
      const data = await authService.register({ email, password, fullName });
      setSuccessMsg(data.message || 'Registration successful! Please check your email to verify.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-split-container">
      {/* Left Column - Marketing Panel */}
      <div className="register-left-panel">
        <div className="register-left-content">
          <h1 className="register-left-title">
            Revolutionize your learning with AI.
          </h1>
          <p className="register-left-sub">
            Join thousands of students using AI to summarize, analyze, and master their study materials in seconds. Your personal academic co-pilot awaits.
          </p>
        </div>

        <div className="register-left-bottom">
          <span className="register-trusted-label">Trusted by students from</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.1)', padding: '8px 16px', borderRadius: '12px', width: 'fit-content' }}>
            <div style={{ width: '26px', height: '26px', background: 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#FF7A00', letterSpacing: '-0.5px' }}>FPT</span>
            </div>
            <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>FPT University</span>
          </div>
        </div>
      </div>

      {/* Right Column - Registration Form Panel */}
      <div className="register-right-panel">
        <div className="register-form-container">
          <div className="register-form-header">
            <h2 className="register-form-title">Create your account</h2>
            <p className="register-form-subtitle">Start your journey to smarter studying today.</p>
          </div>

          {/* Success message */}
          {successMsg && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#16a34a',
              padding: '14px 16px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              marginBottom: '16px',
              textAlign: 'center',
            }}>
              {successMsg}
              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    background: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}

          {/* Error message */}
          {serverError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--color-error)',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '16px',
            }}>
              {serverError}
            </div>
          )}

          <form className="login-modal-form" onSubmit={handleRegister}>
            {/* Full Name */}
            <div className="login-modal-field">
              <label className="login-modal-field-label">Full Name</label>
              <div className="register-input-icon-wrap">
                <span className="register-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  type="text"
                  className="login-modal-input"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              {fullNameError && (
                <p className="error-message" style={{ color: 'var(--color-error)', fontSize: '0.8rem', margin: '4px 0 0' }}>
                  {fullNameError}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="login-modal-field">
              <label className="login-modal-field-label">Student Email</label>
              <div className="register-input-icon-wrap">
                <span className="register-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  type="email"
                  className="login-modal-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              {emailError && (
                <p className="error-message" style={{ color: 'var(--color-error)', fontSize: '0.8rem', margin: '4px 0 0' }}>
                  {emailError}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="login-modal-field">
              <label className="login-modal-field-label">Password</label>
              <div className="register-input-icon-wrap">
                <span className="register-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-modal-input"
                  placeholder="Min. 6 characters"
                  style={{ paddingRight: '48px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="login-modal-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="error-message" style={{ color: 'var(--color-error)', fontSize: '0.8rem', margin: '4px 0 0' }}>
                  {passwordError}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="login-modal-field">
              <label className="login-modal-remember" style={{ alignItems: 'flex-start' }}>
                <input
                  type="checkbox"
                  className="login-modal-checkbox"
                  style={{ marginTop: '3px' }}
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                  I agree to the <Link to="/terms" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Privacy Policy</Link>.
                </span>
              </label>
              {agreeError && (
                <p className="error-message" style={{ color: 'var(--color-error)', fontSize: '0.8rem', margin: '4px 0 0' }}>
                  {agreeError}
                </p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="login-modal-submit" style={{ marginTop: '8px' }} disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
              {!loading && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="login-modal-footer">
            Already have an account?{' '}
            <Link to="/login" className="login-modal-create-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
