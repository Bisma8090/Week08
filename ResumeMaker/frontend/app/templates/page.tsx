'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Slate',
    label: 'Modern & Minimal',
    accent: '#334155',
    gradient: 'linear-gradient(135deg, #1e293b, #334155)',
    desc: 'Two-column layout with a dark sidebar and clean white content area. Great for tech, design, and creative professionals.',
    tags: ['Two Column', 'Sidebar', 'Tech'],
  },
  {
    id: 'professional',
    name: 'Ivory',
    label: 'Elegant & Executive',
    accent: '#2d3748',
    gradient: 'linear-gradient(135deg, #1a202c, #2d3748)',
    desc: 'Light layout with a dark header banner and photo slot. Ideal for senior, executive, and client-facing roles.',
    tags: ['Photo Slot', 'Executive', 'Elegant'],
  },
  {
    id: 'classic',
    name: 'Prestige',
    label: 'Classic & Timeless',
    accent: '#1a365d',
    gradient: 'linear-gradient(135deg, #1a365d, #2b4c7e)',
    desc: 'A bold top-header layout with a dark banner. Clean single-column structure — perfect for corporate and traditional roles.',
    tags: ['ATS Friendly', 'Single Column', 'Corporate'],
  },
];

function IvoryPreview({ scale = 1 }: { scale?: number }) {
  const s = (n: number) => n * scale;
  return (
    <div style={{ width: s(200), height: s(283), background: '#f7f7f7', borderRadius: s(3), overflow: 'hidden', flexShrink: 0, boxShadow: '0 8px 30px rgba(0,0,0,0.5)', fontFamily: 'Arial,sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg,#1a202c 60%,#2d3748)', height: s(60), position: 'relative', display: 'flex', alignItems: 'flex-end', padding: `0 ${s(10)}px ${s(8)}px` }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ width: s(55), height: s(7), background: 'rgba(255,255,255,0.92)', borderRadius: s(1), marginBottom: s(3) }} />
          <div style={{ width: s(38), height: s(4), background: 'rgba(255,255,255,0.55)', borderRadius: s(1) }} />
        </div>
      </div>
      <div style={{ position: 'relative', height: s(22) }}>
        <div style={{ position: 'absolute', left: s(10), top: s(-18), width: s(32), height: s(32), borderRadius: s(3), background: 'linear-gradient(135deg,#4a5568,#718096)', border: `${s(2)}px solid #fff`, zIndex: 2 }} />
      </div>
      <div style={{ display: 'flex', height: s(201) }}>
        <div style={{ width: '36%', background: '#fff', borderRight: `${s(1)}px solid #e2e8f0`, padding: `${s(4)}px ${s(7)}px`, display: 'flex', flexDirection: 'column', gap: s(8) }}>
          {['Contact', 'Proficiency'].map((_, i) => (
            <div key={i}>
              <div style={{ background: '#2d3748', borderRadius: s(2), padding: `${s(2)}px ${s(5)}px`, marginBottom: s(4), display: 'inline-block' }}>
                <div style={{ width: s(22), height: s(4), background: '#fff', borderRadius: s(1) }} />
              </div>
              {[s(28), s(24), s(26)].map((w, j) => (
                <div key={j} style={{ width: w, height: s(3), background: '#9ca3af', borderRadius: s(1), marginBottom: s(3) }} />
              ))}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: `${s(6)}px ${s(8)}px`, display: 'flex', flexDirection: 'column', gap: s(7) }}>
          {['OBJECTIVE', 'PROFESSIONAL SKILLS'].map((sec, i) => (
            <div key={sec}>
              <div style={{ display: 'flex', alignItems: 'center', gap: s(4), marginBottom: s(4) }}>
                <div style={{ flex: 1, height: s(1), background: '#cbd5e0' }} />
                <div style={{ border: `${s(1)}px solid #2d3748`, borderRadius: s(2), padding: `${s(1)}px ${s(5)}px` }}>
                  <div style={{ width: s(i === 0 ? 28 : 42), height: s(4), background: '#2d3748', borderRadius: s(1) }} />
                </div>
                <div style={{ flex: 1, height: s(1), background: '#cbd5e0' }} />
              </div>
              {[0.9, 0.75, 0.6].map((op, j) => (
                <div key={j} style={{ width: `${70 + j * 8}%`, height: s(3), background: '#9ca3af', borderRadius: s(1), opacity: op, marginBottom: s(2) }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlatePreview({ scale = 1 }: { scale?: number }) {
  const s = (n: number) => n * scale;
  return (
    <div style={{ width: s(200), height: s(283), background: '#fff', borderRadius: s(3), overflow: 'hidden', flexShrink: 0, boxShadow: '0 8px 30px rgba(0,0,0,0.5)', display: 'flex', fontFamily: 'Arial,sans-serif' }}>
      <div style={{ width: '34%', background: '#2d3748', padding: `${s(14)}px ${s(8)}px`, display: 'flex', flexDirection: 'column', gap: s(8) }}>
        <div style={{ width: s(38), height: s(38), borderRadius: '50%', background: 'linear-gradient(135deg,#4a5568,#718096)', margin: '0 auto', border: `${s(2)}px solid rgba(255,255,255,0.2)` }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '85%', height: s(6), background: 'rgba(255,255,255,0.85)', borderRadius: s(1), margin: '0 auto', marginBottom: s(3) }} />
          <div style={{ width: '55%', height: s(3), background: 'rgba(255,255,255,0.4)', borderRadius: s(1), margin: '0 auto' }} />
        </div>
        {[s(28), s(20), s(24)].map((w, j) => (
          <div key={j} style={{ width: w, height: s(3), background: 'rgba(255,255,255,0.4)', borderRadius: s(1) }} />
        ))}
      </div>
      <div style={{ flex: 1, padding: `${s(10)}px ${s(8)}px`, display: 'flex', flexDirection: 'column', gap: s(6) }}>
        {['EDUCATION', 'WORK EXPERIENCE', 'SKILLS'].map((sec, i) => (
          <div key={sec}>
            <div style={{ borderBottom: `${s(1)}px solid #2d3748`, paddingBottom: s(2), marginBottom: s(4) }}>
              <div style={{ width: s(i === 0 ? 32 : i === 1 ? 44 : 22), height: s(4), background: '#2d3748', borderRadius: s(1) }} />
            </div>
            {[0.85, 0.65, 0.7].map((op, j) => (
              <div key={j} style={{ width: `${55 + j * 12}%`, height: s(3), background: '#9ca3af', borderRadius: s(1), opacity: op, marginBottom: s(2) }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function PrestigePreview({ scale = 1 }: { scale?: number }) {
  const s = (n: number) => n * scale;
  return (
    <div style={{ width: s(200), height: s(283), background: '#fff', borderRadius: s(3), overflow: 'hidden', flexShrink: 0, boxShadow: '0 8px 30px rgba(0,0,0,0.5)', fontFamily: 'Arial,sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg,#1a365d,#2b4c7e)', padding: `${s(14)}px ${s(12)}px ${s(10)}px` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ width: s(65), height: s(9), background: 'rgba(255,255,255,0.95)', borderRadius: s(1), marginBottom: s(4) }} />
            <div style={{ width: s(45), height: s(5), background: 'rgba(255,255,255,0.6)', borderRadius: s(1), marginBottom: s(6) }} />
          </div>
          <div style={{ width: s(34), height: s(34), borderRadius: s(3), background: 'linear-gradient(135deg,#4a5568,#718096)', border: `${s(2)}px solid rgba(255,255,255,0.3)`, flexShrink: 0 }} />
        </div>
      </div>
      <div style={{ padding: `${s(8)}px ${s(10)}px`, display: 'flex', flexDirection: 'column', gap: s(7) }}>
        {['SUMMARY', 'EXPERIENCE', 'EDUCATION', 'SKILLS'].map((sec, i) => (
          <div key={sec}>
            <div style={{ display: 'flex', alignItems: 'center', gap: s(4), marginBottom: s(4) }}>
              <div style={{ width: s(3), height: s(10), background: '#1a365d', borderRadius: s(1), flexShrink: 0 }} />
              <div style={{ width: s(i === 0 ? 28 : i === 1 ? 36 : i === 2 ? 32 : 20), height: s(4), background: '#1a365d', borderRadius: s(1) }} />
              <div style={{ flex: 1, height: s(1), background: '#cbd5e0' }} />
            </div>
            {[0.85, 0.65].map((op, j) => (
              <div key={j} style={{ width: `${55 + j * 20}%`, height: s(3), background: '#9ca3af', borderRadius: s(1), opacity: op, marginBottom: s(2) }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const PREVIEWS: Record<string, React.FC<{ scale?: number }>> = {
  modern: SlatePreview,
  professional: IvoryPreview,
  classic: PrestigePreview,
};

export default function TemplatesPage() {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const [preview, setPreview] = useState<typeof TEMPLATES[0] | null>(null);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const name = localStorage.getItem('user_name');
    if (name) setUserName(name.split(' ')[0]);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      {/* Nav */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '0 clamp(16px,4vw,40px)', height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #334155, #64748b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff', flexShrink: 0 }}>C</div>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Craft<span style={{ color: '#94a3b8' }}>Folio</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '6px 14px 6px 8px', cursor: 'pointer' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #334155, #64748b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{userName[0]?.toUpperCase()}</div>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500 }}>{userName}</span>
          </div>
        </div>
      </motion.nav>

      {/* Main content */}
      <div style={{ padding: 'clamp(24px,5vw,60px) clamp(16px,4vw,40px)', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,64px)' }}>
          <h1 style={{ fontSize: 'clamp(22px,5vw,44px)', fontWeight: 800, color: '#fff', marginBottom: 16, lineHeight: 1.2 }}>
            Pick Your Perfect Layout<br />
            <span style={{ background: 'linear-gradient(135deg,#64748b,#cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              and Start Building
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(13px,2vw,16px)', maxWidth: 560, margin: '0 auto' }}>
            Three distinct designs — each with its own structure, style, and personality. Pick the one that fits your story.
          </p>
        </motion.div>

        {/* Template grid */}
        <div className="templates-grid">
          {TEMPLATES.map((t, i) => {
            const Preview = PREVIEWS[t.id];
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                onHoverStart={() => setHovered(t.id)} onHoverEnd={() => setHovered(null)} style={{ position: 'relative' }}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: `0 28px 60px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.15)` }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer' }}
                >
                  {/* Preview area */}
                  <div className="template-preview-area">
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, #d1d5db 0%, #9ca3af 100%)', opacity: 0.5 }} />
                    <div style={{ position: 'relative', zIndex: 1 }} className="template-preview-scale">
                      <Preview scale={1} />
                    </div>
                    <AnimatePresence>
                      {hovered === t.id && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, zIndex: 2 }}>
                          <motion.button initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.05 }}
                            onClick={() => router.push(`/builder?template=${t.id}`)}
                            style={{ background: '#fff', border: 'none', color: '#1a202c', borderRadius: 8, padding: '11px 28px', cursor: 'pointer', fontSize: 14, fontWeight: 700, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                            Use This Template
                          </motion.button>
                          <motion.button initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                            onClick={() => setPreview(t)}
                            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: 8, padding: '10px 28px', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                            Preview
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Card info */}
                  <div style={{ padding: 'clamp(14px,2vw,22px)', background: 'rgba(15,23,42,0.8)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 'clamp(14px,2vw,17px)', margin: 0 }}>{t.name}</h3>
                      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>— {t.label}</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 1.6, margin: '0 0 12px' }}>{t.desc}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {t.tags.map(tag => (
                        <span key={tag} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: 11, borderRadius: 5, padding: '3px 9px', fontWeight: 500 }}>{tag}</span>
                      ))}
                    </div>
                    {/* Mobile CTA */}
                    <button
                      className="mobile-use-btn"
                      onClick={() => router.push(`/builder?template=${t.id}`)}
                      style={{ display: 'none', width: '100%', marginTop: 14, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 8, padding: '10px', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                      Use This Template →
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setPreview(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px,4vw,40px)' }}>
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="preview-modal">
              <div className="preview-modal-thumb">
                {(() => { const P = PREVIEWS[preview.id]; return <P scale={1} />; })()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ color: '#fff', fontSize: 'clamp(18px,3vw,26px)', fontWeight: 700, marginBottom: 6 }}>{preview.name}</h2>
                <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 14 }}>{preview.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.7, marginBottom: 22 }}>{preview.desc}</p>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 28 }}>
                  {preview.tags.map(tag => (
                    <span key={tag} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', fontSize: 12, borderRadius: 6, padding: '4px 12px' }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => router.push(`/builder?template=${preview.id}`)}
                    style={{ background: '#fff', border: 'none', color: '#1a202c', borderRadius: 8, padding: '11px 26px', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                    Use This Template
                  </motion.button>
                  <button onClick={() => setPreview(null)}
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: 8, padding: '11px 18px', cursor: 'pointer', fontSize: 14 }}>
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .templates-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .template-preview-area {
          height: 320px;
          background: #e8eaed;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .template-preview-scale {
          transform: scale(1.05);
          transform-origin: center;
        }
        .preview-modal {
          background: rgba(15,23,42,0.98);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: clamp(20px,4vw,40px);
          max-width: 680px;
          width: 100%;
          display: flex;
          gap: clamp(16px,4vw,40px);
          align-items: center;
          max-height: 90vh;
          overflow-y: auto;
        }
        .preview-modal-thumb {
          flex-shrink: 0;
        }

        @media (max-width: 900px) {
          .templates-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }
        @media (max-width: 580px) {
          .templates-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .template-preview-area {
            height: 260px;
          }
          .template-preview-scale {
            transform: scale(0.9);
          }
          .mobile-use-btn {
            display: block !important;
          }
          .preview-modal {
            flex-direction: column;
            align-items: flex-start;
            padding: 20px;
          }
          .preview-modal-thumb {
            align-self: center;
            transform: scale(0.85);
            transform-origin: center top;
          }
        }
        @media (max-width: 400px) {
          .template-preview-scale {
            transform: scale(0.75);
          }
          .preview-modal-thumb {
            transform: scale(0.7);
          }
        }
      `}</style>
    </div>
  );
}
