import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/images/logo.png';
import '../../styles/components.css';
import authService from '../../services/authService';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    let hasError = false;
    setServerError('');

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

    if (hasError) return;

    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      // Save user info + token
      const user = {
        userId: data.userId,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        token: data.token,
      };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', data.token);

      if (data.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="login-modal-card" style={{ textAlign: 'center' }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <Link to="/">
            <img
              src={logoImg}
              alt="FSTUDY"
              style={{
                height: '56px',
                objectFit: 'contain',
                mixBlendMode: 'multiply',
                transition: 'transform 0.2s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </Link>
        </div>

        {/* Header */}
        <div className="login-modal-header">
          <span className="login-modal-secure-label">SECURE ACCESS</span>
          <h2 className="login-modal-title">Welcome back</h2>
          <p className="login-modal-subtitle">Enter your credentials to continue</p>
        </div>

        {/* Server error */}
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

        {/* Form */}
        <form className="login-modal-form" onSubmit={handleLogin}>
          {/* Email */}
          <div className="login-modal-field">
            <label className="login-modal-field-label">Email Address</label>
            <input
              type="email"
              className="login-modal-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {emailError && (
              <p className="error-message" style={{ color: 'var(--color-error)', fontSize: '0.8rem', margin: '4px 0 0' }}>
                {emailError}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="login-modal-field">
            <div className="login-modal-field-row">
              <label className="login-modal-field-label">Password</label>
              <Link to="/forgot-password" className="login-modal-forgot">
                Forgot password?
              </Link>
            </div>
            <div className="login-modal-password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-modal-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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

          {/* Remember me */}
          <label className="login-modal-remember">
            <input
              type="checkbox"
              className="login-modal-checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember me</span>
          </label>

          {/* Sign In button */}
          <button type="submit" className="login-modal-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
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
          Don't have an account?{' '}
          <Link to="/register" className="login-modal-create-link">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
