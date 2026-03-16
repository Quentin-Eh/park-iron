import { useState } from 'react';

interface Props {
  loading: boolean;
  error: string | null;
  onMagicLink: (email: string) => void;
  onGoogle: () => void;
  onSkip: () => void;
}

export function AuthScreen({ loading, error, onMagicLink, onGoogle, onSkip }: Props) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onMagicLink(email.trim());
    setSent(true);
  };

  return (
    <div style={{
      padding: 'var(--space-5) var(--space-4)',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }} className="fade-in">
      <div style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
        <h1 style={{
          fontSize: 'var(--text-4xl)', fontWeight: 900, letterSpacing: -1.5,
          background: 'linear-gradient(135deg,#FF6B35,#4ECDC4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 'var(--space-2)',
        }}>
          PARK IRON
        </h1>
        <p className="text-body" style={{ fontWeight: 500 }}>
          Sign in to sync your workouts across devices
        </p>
      </div>

      {sent ? (
        <div style={{
          background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)', textAlign: 'center', marginBottom: 'var(--space-5)',
        }}>
          <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
            Check your email
          </p>
          <p className="text-body" style={{ lineHeight: 1.5 }}>
            We sent a magic link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
            Tap the link to sign in.
          </p>
          <button onClick={() => setSent(false)} style={{
            marginTop: 'var(--space-4)', background: 'none', border: 'none',
            color: '#4ECDC4', fontSize: 'var(--text-base)', fontWeight: 600, cursor: 'pointer',
          }}>
            Use a different email
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} style={{ marginBottom: 'var(--space-4)' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              style={{
                width: '100%', padding: '16px var(--space-4)', borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-strong)', background: 'var(--bg-surface)',
                color: 'var(--text-primary)', fontSize: 'var(--text-lg)',
                fontFamily: 'var(--font-ui)', marginBottom: 'var(--space-3)',
                outline: 'none',
              }}
            />
            <button type="submit" className="btn-primary" disabled={loading} style={{
              background: 'linear-gradient(135deg,#4ECDC4,rgba(78,205,196,0.67))',
              opacity: loading ? 0.6 : 1,
            }}>
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
            margin: 'var(--space-3) 0',
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
          </div>

          <button onClick={onGoogle} disabled={loading} style={{
            width: '100%', padding: '16px', borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-strong)', background: 'var(--bg-surface)',
            color: 'var(--text-primary)', fontSize: 'var(--text-lg)', fontWeight: 700,
            cursor: 'pointer', marginBottom: 'var(--space-5)',
          }}>
            Continue with Google
          </button>
        </>
      )}

      {error && (
        <p style={{
          color: 'var(--color-error)', fontSize: 'var(--text-base)',
          textAlign: 'center', marginBottom: 'var(--space-4)',
        }}>
          {error}
        </p>
      )}

      <button onClick={onSkip} style={{
        background: 'none', border: 'none', color: 'var(--text-secondary)',
        fontSize: 'var(--text-base)', fontWeight: 600, cursor: 'pointer',
        padding: 'var(--space-3)', textAlign: 'center',
      }}>
        Continue without account
      </button>
    </div>
  );
}
