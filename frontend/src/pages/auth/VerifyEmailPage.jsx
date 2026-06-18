import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import logoImg from '../../assets/images/logo.png';
import authService from '../../services/authService';

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');
  const [manualToken, setManualToken] = useState(token);

  // Auto-verify if token is in URL
  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token]);

  const verifyToken = async (tokenValue) => {
    if (!tokenValue) {
      setStatus('idle');
      setMessage('');
      return;
    }

    setStatus('loading');
    setMessage('Verifying...');
    try {
      const data = await authService.verifyEmail(tokenValue);
      setStatus('success');
      setMessage(data.message || 'Email verified successfully! You can now login.');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
    }
  };

  const handleManualVerify = (e) => {
    e.preventDefault();
    verifyToken(manualToken);
  };

  return (
    <div className="auth-shell">
      <div className="login-modal-card">
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
        <div className="login-modal-header" style={{ marginBottom: '20px' }}>
          <span className="login-modal-secure-label" style={{ letterSpacing: '0.08em' }}>IDENTITY VERIFICATION</span>
          <h2 className="login-modal-title" style={{ fontSize: '1.65rem' }}>Verify your email</h2>
          <p className="login-modal-subtitle" style={{ fontSize: '0.88rem', padding: '0 10px', lineHeight: '1.5' }}>
            {email ? (
              <>We've sent a verification link to<br /><strong style={{ color: 'var(--color-text)' }}>{email}</strong></>
            ) : (
              'Enter the token from your verification email below.'
            )}
          </p>
        </div>

        {/* Status display */}
        {status === 'loading' && (
          <div style={{
            background: 'rgba(79, 70, 229, 0.1)',
            border: '1px solid rgba(79, 70, 229, 0.3)',
            color: 'var(--color-primary)',
            padding: '14px 16px',
            borderRadius: '8px',
            fontSize: '0.88rem',
            textAlign: 'center',
            marginBottom: '16px',
          }}>
            {message}
          </div>
        )}

        {status === 'success' && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#16a34a',
            padding: '14px 16px',
            borderRadius: '8px',
            fontSize: '0.88rem',
            textAlign: 'center',
            marginBottom: '16px',
          }}>
            {message}
            <div style={{ marginTop: '12px' }}>
              <Link
                to="/login"
                style={{
                  display: 'inline-block',
                  background: 'var(--color-primary)',
                  color: 'white',
                  padding: '10px 28px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Go to Login
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--color-error)',
            padding: '14px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            textAlign: 'center',
            marginBottom: '16px',
          }}>
            {message}
          </div>
        )}

        {/* Manual token input (fallback) */}
        {(status === 'idle' || status === 'error') && (
          <form className="login-modal-form" onSubmit={handleManualVerify}>
            <div className="login-modal-field">
              <label className="login-modal-field-label">Verification Token</label>
              <input
                type="text"
                className="login-modal-input"
                placeholder="Paste your token here"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
              />
            </div>

            <button type="submit" className="login-modal-submit" style={{ marginTop: '8px' }}>
              Verify
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </form>
        )}

        {/* Back to Login */}
        <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'var(--color-text-soft)', fontWeight: 600, fontSize: '0.88rem', marginTop: '24px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
