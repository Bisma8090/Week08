'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    // Save email prefix as name for display if no name stored
    if (!localStorage.getItem('user_name')) {
      const emailName = form.email.split('@')[0];
      localStorage.setItem('user_name', emailName);
    }
    router.push('/templates');
  };

  const features = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      text: 'Beautiful Professional Templates'
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      ),
      text: 'Fully Customizable Designs'
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      ),
      text: 'Export to PDF & Word'
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
      text: 'Ready in Minutes'
    },
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexWrap: 'wrap',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    }}>
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        style={{
          flex: '1 1 340px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(32px,6vw,60px)', position: 'relative', overflow: 'hidden', minHeight: 300,
        }}
      >
        <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(51,65,85,0.3)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(71,85,105,0.2)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #334155, #64748b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#fff', boxShadow: '0 4px 20px rgba(51,65,85,0.5)' }}>C</div>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>Craft<span style={{ color: '#94a3b8' }}>Folio</span></span>
          </div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,38px)', fontWeight: 800, color: '#fff', marginBottom: 12, lineHeight: 1.2 }}>
            Welcome Back!<br />
            <span style={{ background: 'linear-gradient(135deg,#64748b,#cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Let&apos;s Continue
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, marginBottom: 40 }}>Sign in to access your resumes and keep building</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {features.map((feature, i) => (
              <motion.div key={feature.text} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ flexShrink: 0, color: 'rgba(148,163,184,0.85)', display: 'flex' }}>{feature.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: 500 }}>{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        style={{
          flex: '1 1 320px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255,255,255,0.07)', padding: 'clamp(32px,5vw,60px) clamp(24px,5vw,48px)',
        }}
      >
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Sign in</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 36 }}>Welcome back - enter your details below</p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Field label="Email address" type="email" placeholder="you@example.com" value={form.email}
              onChange={v => { setForm(p => ({ ...p, email: v })); setErrors(p => ({ ...p, email: undefined })); }}
              error={errors.email} />
            <Field label="Password" type="password" placeholder="••••••••" value={form.password}
              onChange={v => { setForm(p => ({ ...p, password: v })); setErrors(p => ({ ...p, password: undefined })); }}
              error={errors.password} />
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(51,65,85,0.6)' }}
              whileTap={{ scale: 0.98 }}
              style={{ background: 'linear-gradient(135deg, #334155, #475569)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 10, padding: '14px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 700, marginTop: 4, boxShadow: '0 4px 20px rgba(51,65,85,0.4)', opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  Signing in...
                </span>
              ) : 'Continue →'}
            </motion.button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 28, color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
            No account?{' '}
            <span onClick={() => router.push('/signup')} style={{ color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>Create one</span>
          </p>
        </div>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Field({ label, type, placeholder, value, onChange, error }: {
  label: string; type: string; placeholder: string;
  value: string; onChange: (v: string) => void; error?: string;
}) {
  return (
    <div>
      <label style={{ display: 'block', color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.07)', border: `1px solid ${error ? '#f87171' : 'rgba(255,255,255,0.12)'}`, borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
        onFocus={e => { if (!error) e.target.style.borderColor = 'rgba(100,116,139,0.6)'; }}
        onBlur={e => { if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
      />
      {error && <p style={{ color: '#f87171', fontSize: 12, marginTop: 5 }}>{error}</p>}
    </div>
  );
}
