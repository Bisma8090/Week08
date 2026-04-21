'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (!form.confirm) e.confirm = 'Please confirm your password';
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    localStorage.setItem('user_name', form.name.trim());
    router.push('/templates');
  };

  const perks = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
        </svg>
      ),
      text: 'Professionally crafted templates'
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      text: 'Add your photo with custom styling'
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
      text: 'Download as PDF or Word document'
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      ),
      text: '11 fully customizable sections'
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      ),
      text: 'Works on any device'
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
      text: '100% free to get started'
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
        <div style={{ position: 'absolute', top: -120, left: -120, width: 450, height: 450, borderRadius: '50%', background: 'rgba(51,65,85,0.2)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #334155, #64748b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#fff', boxShadow: '0 4px 20px rgba(51,65,85,0.5)' }}>C</div>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>Craft<span style={{ color: '#94a3b8' }}>Folio</span></span>
          </div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,38px)', fontWeight: 800, color: '#fff', marginBottom: 12, lineHeight: 1.2 }}>
            Your Career Story<br />
            <span style={{ background: 'linear-gradient(135deg,#64748b,#cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Starts Here</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 40 }}>Create a resume that stands out from the crowd</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {perks.map((perk, i) => (
              <motion.div key={perk.text} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ flexShrink: 0, color: 'rgba(148,163,184,0.85)', display: 'flex' }}>{perk.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{perk.text}</span>
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
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Create account</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 32 }}>Fill in your details to get started</p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <SField label="Full Name" type="text" placeholder="John Doe" value={form.name}
              onChange={v => { setForm(p => ({ ...p, name: v })); setErrors(p => ({ ...p, name: '' })); }} error={errors.name} />
            <SField label="Email address" type="email" placeholder="you@example.com" value={form.email}
              onChange={v => { setForm(p => ({ ...p, email: v })); setErrors(p => ({ ...p, email: '' })); }} error={errors.email} />
            <SField label="Password" type="password" placeholder="Min. 6 characters" value={form.password}
              onChange={v => { setForm(p => ({ ...p, password: v })); setErrors(p => ({ ...p, password: '' })); }} error={errors.password} />
            <SField label="Confirm Password" type="password" placeholder="Repeat password" value={form.confirm}
              onChange={v => { setForm(p => ({ ...p, confirm: v })); setErrors(p => ({ ...p, confirm: '' })); }} error={errors.confirm} />
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(51,65,85,0.6)' }} whileTap={{ scale: 0.98 }}
              style={{ background: 'linear-gradient(135deg, #334155, #475569)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 10, padding: '14px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 700, marginTop: 4, boxShadow: '0 4px 20px rgba(51,65,85,0.4)', opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </motion.button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 28, color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
            Already have an account?{' '}
            <span onClick={() => router.push('/login')} style={{ color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>Sign in</span>
          </p>
        </div>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function SField({ label, type, placeholder, value, onChange, error }: {
  label: string; type: string; placeholder: string; value: string; onChange: (v: string) => void; error?: string;
}) {
  return (
    <div>
      <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500, marginBottom: 7 }}>{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${error ? '#f87171' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
        onFocus={e => { if (!error) e.target.style.borderColor = 'rgba(100,116,139,0.6)'; }}
        onBlur={e => { if (!error) e.target.style.borderColor = error ? '#f87171' : 'rgba(255,255,255,0.1)'; }} />
      {error && <p style={{ color: '#f87171', fontSize: 12, marginTop: 5 }}>{error}</p>}
    </div>
  );
}
