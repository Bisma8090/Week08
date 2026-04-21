'use client';
import { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CvData, Education, Experience, Project, Profile, Language, Award, PictureSettings } from '@/types/cv';
import ImageIcon from '@mui/icons-material/Image';
import PersonIcon from '@mui/icons-material/Person';
import NotesIcon from '@mui/icons-material/Notes';
import LinkIcon from '@mui/icons-material/Link';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BoltIcon from '@mui/icons-material/Bolt';
import LanguageIcon from '@mui/icons-material/Language';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const TEMPLATES = [
  { id: 'modern', name: 'Slate', accent: '#334155', gradient: 'linear-gradient(135deg,#1e293b,#334155)' },
  { id: 'professional', name: 'Ivory', accent: '#2d3748', gradient: 'linear-gradient(135deg,#1a202c,#2d3748)' },
  { id: 'classic', name: 'Prestige', accent: '#1a365d', gradient: 'linear-gradient(135deg,#1a365d,#2b4c7e)' },
] as const;

const NAV = [
  { id: 'picture', icon: <ImageIcon sx={{ fontSize: 18 }} />, label: 'Picture' },
  { id: 'basics', icon: <PersonIcon sx={{ fontSize: 18 }} />, label: 'Basics' },
  { id: 'summary', icon: <NotesIcon sx={{ fontSize: 18 }} />, label: 'Summary' },
  { id: 'profiles', icon: <LinkIcon sx={{ fontSize: 18 }} />, label: 'Profiles' },
  { id: 'experience', icon: <WorkIcon sx={{ fontSize: 18 }} />, label: 'Experience' },
  { id: 'education', icon: <SchoolIcon sx={{ fontSize: 18 }} />, label: 'Education' },
  { id: 'projects', icon: <RocketLaunchIcon sx={{ fontSize: 18 }} />, label: 'Projects' },
  { id: 'skills', icon: <BoltIcon sx={{ fontSize: 18 }} />, label: 'Skills' },
  { id: 'languages', icon: <LanguageIcon sx={{ fontSize: 18 }} />, label: 'Languages' },
  { id: 'interests', icon: <FavoriteIcon sx={{ fontSize: 18 }} />, label: 'Interests' },
  { id: 'awards', icon: <EmojiEventsIcon sx={{ fontSize: 18 }} />, label: 'Awards' },
];

const emptyEdu = (): Education => ({ degree: '', institution: '', year: '', gpa: '' });
const emptyExp = (): Experience => ({ title: '', company: '', duration: '', description: '' });
const emptyProject = (): Project => ({ name: '', description: '', link: '' });
const emptyProfile = (): Profile => ({ platform: '', url: '' });
const emptyLang = (): Language => ({ name: '', level: 'Conversational' });
const emptyAward = (): Award => ({ title: '', issuer: '', year: '' });

const defaultPicture: PictureSettings = { size: 100, rotation: 0, aspectRatio: '1:1', borderRadius: 50 };

const EMPTY_CV: CvData = {
  fullName: '',
  headline: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  profiles: [],
  experience: [],
  education: [],
  projects: [],
  skills: '',
  languages: [],
  interests: '',
  awards: [],
  template: 'classic',
};

// ─── Template preview thumbnails (same as templates page) ────────────────────

function SlateThumb({ scale = 1 }: { scale?: number }) {
  const s = (n: number) => n * scale;
  return (
    <div style={{ width: s(200), height: s(283), background: '#fff', borderRadius: s(3), overflow: 'hidden', flexShrink: 0, display: 'flex', fontFamily: 'Arial,sans-serif' }}>
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
        {['EDUCATION', 'EXPERIENCE', 'SKILLS'].map((sec, i) => (
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

function IvoryThumb({ scale = 1 }: { scale?: number }) {
  const s = (n: number) => n * scale;
  return (
    <div style={{ width: s(200), height: s(283), background: '#f7f7f7', borderRadius: s(3), overflow: 'hidden', flexShrink: 0, fontFamily: 'Arial,sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg,#1a202c 60%,#2d3748)', height: s(55), display: 'flex', alignItems: 'flex-end', padding: `0 ${s(10)}px ${s(8)}px` }}>
        <div>
          <div style={{ width: s(55), height: s(7), background: 'rgba(255,255,255,0.92)', borderRadius: s(1), marginBottom: s(3) }} />
          <div style={{ width: s(38), height: s(4), background: 'rgba(255,255,255,0.55)', borderRadius: s(1) }} />
        </div>
      </div>
      <div style={{ display: 'flex', height: s(228) }}>
        <div style={{ width: '36%', background: '#fff', borderRight: `${s(1)}px solid #e2e8f0`, padding: `${s(8)}px ${s(7)}px`, display: 'flex', flexDirection: 'column', gap: s(8) }}>
          {['Contact', 'Proficiency'].map((sec, i) => (
            <div key={sec}>
              <div style={{ background: '#2d3748', borderRadius: s(2), padding: `${s(2)}px ${s(5)}px`, marginBottom: s(4), display: 'inline-block' }}>
                <div style={{ width: s(i === 0 ? 22 : 28), height: s(4), background: '#fff', borderRadius: s(1) }} />
              </div>
              {[s(28), s(22), s(26)].map((w, j) => (
                <div key={j} style={{ width: w, height: s(3), background: '#9ca3af', borderRadius: s(1), marginBottom: s(3) }} />
              ))}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: `${s(6)}px ${s(8)}px`, display: 'flex', flexDirection: 'column', gap: s(7) }}>
          {['OBJECTIVE', 'EXPERIENCE'].map((sec, i) => (
            <div key={sec}>
              <div style={{ display: 'flex', alignItems: 'center', gap: s(4), marginBottom: s(4) }}>
                <div style={{ flex: 1, height: s(1), background: '#cbd5e0' }} />
                <div style={{ border: `${s(1)}px solid #2d3748`, borderRadius: s(2), padding: `${s(1)}px ${s(5)}px` }}>
                  <div style={{ width: s(i === 0 ? 28 : 36), height: s(4), background: '#2d3748', borderRadius: s(1) }} />
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

function PrestigeThumb({ scale = 1 }: { scale?: number }) {
  const s = (n: number) => n * scale;
  return (
    <div style={{ width: s(200), height: s(283), background: '#fff', borderRadius: s(3), overflow: 'hidden', flexShrink: 0, fontFamily: 'Arial,sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg,#1a365d,#2b4c7e)', padding: `${s(14)}px ${s(12)}px ${s(10)}px` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ width: s(65), height: s(9), background: 'rgba(255,255,255,0.95)', borderRadius: s(1), marginBottom: s(4) }} />
            <div style={{ width: s(45), height: s(5), background: 'rgba(255,255,255,0.6)', borderRadius: s(1), marginBottom: s(6) }} />
            <div style={{ display: 'flex', gap: s(6) }}>
              {[s(30), s(26), s(28)].map((w, j) => (
                <div key={j} style={{ width: w, height: s(3), background: 'rgba(255,255,255,0.45)', borderRadius: s(1) }} />
              ))}
            </div>
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

const TEMPLATE_PREVIEWS: Record<string, React.FC<{ scale?: number }>> = {
  modern: SlateThumb,
  professional: IvoryThumb,
  classic: PrestigeThumb,
};

function BuilderInner() {
  const router = useRouter();
  const params = useSearchParams();
  const initTemplate = (params.get('template') as CvData['template']) || 'modern';
  const fileRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<CvData>({ ...EMPTY_CV, template: initTemplate, picture: defaultPicture });
  const [activeSection, setActiveSection] = useState('basics');
  const [showTemplatePanel, setShowTemplatePanel] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(false);
  void setShowMobileNav; // used via mobile-tabs toggle
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  // Close download menu on outside click
  useEffect(() => {
    if (!showDownloadMenu) return;
    const handler = () => setShowDownloadMenu(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showDownloadMenu]);

  const update = (field: keyof CvData, value: unknown) => setData(prev => ({ ...prev, [field]: value }));
  const updatePic = (field: keyof PictureSettings, val: unknown) =>
    setData(prev => ({ ...prev, picture: { ...(prev.picture || defaultPicture), [field]: val } as PictureSettings }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => updatePic('dataUrl', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const updateArr = <T,>(field: keyof CvData, arr: T[], i: number, key: keyof T, val: string) => {
    const copy = [...arr] as T[];
    copy[i] = { ...copy[i], [key]: val };
    update(field, copy);
  };

  const removeArr = <T,>(field: keyof CvData, arr: T[], i: number) =>
    update(field, arr.filter((_, j) => j !== i));

  // Build preview HTML inline (no backend needed)
  const previewHtml = buildPreviewHtml(data);

  const handleDownloadPdf = useCallback(async () => {
    setShowDownloadMenu(false);
    const html2pdf = (await import('html2pdf.js')).default;
    const container = document.createElement('div');
    container.innerHTML = previewHtml;
    container.style.cssText = 'margin:0;padding:0;background:#fff;';
    document.body.appendChild(container);
    await html2pdf()
      .set({
        margin: 0,
        filename: `${(data.fullName || 'CV').replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(container)
      .save();
    document.body.removeChild(container);
  }, [data, previewHtml]);

  const handleDownloadWord = useCallback(() => {
    setShowDownloadMenu(false);
    const fullHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><style>body{margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif}@page{size:21cm 29.7cm;margin:0}</style></head><body>${previewHtml}</body></html>`;
    const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(data.fullName || 'CV').replace(/\s+/g, '_')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data, previewHtml]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveMsg('Saved!');
      setTimeout(() => setSaveMsg(''), 2500);
    }, 800);
  };

  const activeTemplate = TEMPLATES.find(t => t.id === data.template) || TEMPLATES[1];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0f172a', overflow: 'hidden' }}>
      {/* Header */}
      <motion.header initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{ background: 'rgba(15,23,42,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 clamp(10px,2vw,20px)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => router.push('/templates')}
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
            <ArrowBackIcon sx={{ fontSize: 14 }} /> <span className="hide-xs">Templates</span>
          </button>
          <span style={{ background: activeTemplate.gradient, color: '#fff', fontSize: 11, borderRadius: 6, padding: '2px 8px', fontWeight: 600 }}>{activeTemplate.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {saveMsg && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#4ade80', fontSize: 13 }}>✓ {saveMsg}</motion.span>}
          <button onClick={handleSave} disabled={saving}
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
            <SaveIcon sx={{ fontSize: 15 }} /> <span className="hide-xs">{saving ? '...' : 'Save'}</span>
          </button>
          <div style={{ position: 'relative' }}>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={(e) => { e.stopPropagation(); setShowDownloadMenu(v => !v); }}
              style={{ background: 'linear-gradient(135deg,#334155,#475569)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
              <DownloadIcon sx={{ fontSize: 15 }} /> <span className="hide-xs">Download</span> <span style={{ fontSize: 10, opacity: 0.8 }}>▼</span>
            </motion.button>
            <AnimatePresence>
              {showDownloadMenu && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  onClick={e => e.stopPropagation()}
                  style={{ position: 'absolute', top: '110%', right: 0, background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', minWidth: 160, zIndex: 200, boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
                  <button onClick={handleDownloadPdf}
                    style={{ width: '100%', background: 'none', border: 'none', color: '#e0e0e0', padding: '11px 16px', cursor: 'pointer', fontSize: 13, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                    <PictureAsPdfIcon sx={{ fontSize: 15 }} /> Save as PDF
                  </button>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />
                  <button onClick={handleDownloadWord}
                    style={{ width: '100%', background: 'none', border: 'none', color: '#e0e0e0', padding: '11px 16px', cursor: 'pointer', fontSize: 13, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                    <DescriptionIcon sx={{ fontSize: 15 }} /> Save as Word
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* Mobile tab switcher */}
      <div className="mobile-tabs">
        <button
          onClick={() => setMobileTab('form')}
          style={{ flex: 1, background: mobileTab === 'form' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: mobileTab === 'form' ? '#fff' : '#64748b', padding: '10px', cursor: 'pointer', fontSize: 13, fontWeight: 600, borderBottom: mobileTab === 'form' ? '2px solid #94a3b8' : '2px solid transparent' }}>
          Edit
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          style={{ flex: 1, background: mobileTab === 'preview' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: mobileTab === 'preview' ? '#fff' : '#64748b', padding: '10px', cursor: 'pointer', fontSize: 13, fontWeight: 600, borderBottom: mobileTab === 'preview' ? '2px solid #94a3b8' : '2px solid transparent' }}>
          Preview
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Icon rail — hidden on mobile */}
        <div className="icon-rail">
          {NAV.map(s => (
            <motion.button key={s.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection(s.id)} title={s.label}
              style={{ background: activeSection === s.id ? 'rgba(255,255,255,0.12)' : 'transparent', border: activeSection === s.id ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent', color: activeSection === s.id ? '#fff' : 'rgba(255,255,255,0.35)', borderRadius: 10, width: 38, height: 38, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {s.icon}
            </motion.button>
          ))}
        </div>

        {/* Form panel */}
        <div className={`form-panel${mobileTab === 'form' ? ' mobile-visible' : ' mobile-hidden'}`}>
          {/* Mobile section nav */}
          <div className="mobile-section-nav">
            {NAV.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                style={{ background: activeSection === s.id ? 'rgba(255,255,255,0.12)' : 'transparent', border: activeSection === s.id ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)', color: activeSection === s.id ? '#fff' : '#64748b', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', flexShrink: 0 }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-section-header">
            <span style={{ color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center' }}>{NAV.find(s => s.id === activeSection)?.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>
              {NAV.find(s => s.id === activeSection)?.label}
            </span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeSection} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}>
                <SectionContent
                  section={activeSection} data={data} update={update} updateArr={updateArr} removeArr={removeArr}
                  updatePic={updatePic} fileRef={fileRef} handleImageUpload={handleImageUpload}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Preview canvas */}
        <div className={`preview-canvas${mobileTab === 'preview' ? ' mobile-visible' : ' mobile-hidden'}`}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ width: '210mm', minHeight: '297mm', maxWidth: '100%', background: '#fff', borderRadius: 4, boxShadow: '0 20px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)' }}>
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </motion.div>
        </div>

        {/* Template panel — desktop only */}
        <AnimatePresence>
          {showTemplatePanel && (
            <motion.div initial={{ x: 230, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 230, opacity: 0 }}
              className="template-panel">
              <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>Templates</span>
                <button onClick={() => setShowTemplatePanel(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 18 }}>×</button>
              </div>
              <div style={{ padding: '10px' }}>
                {TEMPLATES.map(t => {
                  const Preview = TEMPLATE_PREVIEWS[t.id];
                  return (
                    <motion.button key={t.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => update('template', t.id as CvData['template'])}
                      style={{ width: '100%', marginBottom: 10, border: data.template === t.id ? `2px solid ${t.accent}` : '2px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s' }}>
                      <div style={{ height: 120, background: '#e8eaed', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center,#d1d5db 0%,#9ca3af 100%)', opacity: 0.5 }} />
                        <div style={{ position: 'relative', zIndex: 1, transform: 'scale(0.55)', transformOrigin: 'center' }}>
                          <Preview scale={1} />
                        </div>
                        {data.template === t.id && (
                          <div style={{ position: 'absolute', top: 5, right: 5, background: t.accent, color: '#fff', fontSize: 10, borderRadius: 4, padding: '2px 6px', fontWeight: 700, zIndex: 2 }}>✓</div>
                        )}
                      </div>
                      <div style={{ padding: '8px 10px' }}>
                        <span style={{ color: '#e0e0e0', fontWeight: 600, fontSize: 13 }}>{t.name}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showTemplatePanel && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => setShowTemplatePanel(true)}
            className="template-toggle-btn">
            Templates
          </motion.button>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />

      <style>{`
        .hide-xs { display: inline; }
        .mobile-tabs { display: none; }
        .mobile-section-nav { display: none; }
        .desktop-section-header { display: flex; }
        .icon-rail {
          width: 52px;
          background: rgba(15,23,42,0.9);
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 10px;
          gap: 3px;
          flex-shrink: 0;
          overflow-y: auto;
        }
        .form-panel {
          width: clamp(240px,25vw,300px);
          background: rgba(15,23,42,0.95);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          flex-shrink: 0;
        }
        .preview-canvas {
          flex: 1;
          background: #0d1117;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: clamp(16px,3vw,32px) clamp(12px,2vw,24px);
        }
        .template-panel {
          width: clamp(180px,18vw,220px);
          background: rgba(15,23,42,0.95);
          backdrop-filter: blur(20px);
          border-left: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
          overflow-y: auto;
        }
        .template-toggle-btn {
          position: fixed;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(135deg,#334155,#475569);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          border-radius: 10px;
          padding: 12px 8px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          writing-mode: vertical-rl;
          z-index: 50;
        }

        @media (max-width: 768px) {
          .hide-xs { display: none; }
          .mobile-tabs {
            display: flex;
            background: rgba(15,23,42,0.97);
            border-bottom: 1px solid rgba(255,255,255,0.07);
            flex-shrink: 0;
          }
          .icon-rail { display: none; }
          .template-panel { display: none; }
          .template-toggle-btn { display: none; }
          .form-panel {
            width: 100%;
            flex-shrink: 0;
          }
          .form-panel.mobile-hidden { display: none; }
          .form-panel.mobile-visible { display: flex; }
          .preview-canvas.mobile-hidden { display: none; }
          .preview-canvas.mobile-visible { display: flex; flex: 1; }
          .desktop-section-header { display: none !important; }
          .mobile-section-nav {
            display: flex;
            gap: 6px;
            padding: 10px 12px;
            overflow-x: auto;
            border-bottom: 1px solid rgba(255,255,255,0.07);
            flex-shrink: 0;
          }
          .mobile-section-nav::-webkit-scrollbar { height: 0; }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      `}</style>
    </div>
  );
}

// ─── CV HTML renderer ────────────────────────────────────────────────────────

// ─── CV HTML renderer ────────────────────────────────────────────────────────

function buildPreviewHtml(d: CvData): string {
  const picSize = d.picture?.size || 90;
  const picRadius = d.picture?.borderRadius ?? 50;
  const picRotation = d.picture?.rotation || 0;
  const pic = d.picture?.dataUrl
    ? `<img src="${d.picture.dataUrl}" style="width:${picSize}px;height:${picSize}px;border-radius:${picRadius}%;object-fit:cover;transform:rotate(${picRotation}deg);display:block;" />`
    : '';

  const expHtml = (d.experience || []).map(e =>
    `<div style="margin-bottom:12px"><table style="width:100%;border-collapse:collapse"><tr><td style="font-weight:700;font-size:13px;color:#1a202c">${e.title}</td><td style="font-size:11px;color:#718096;text-align:right;white-space:nowrap">${e.duration}</td></tr></table><div style="font-size:12px;color:#4a5568;margin-bottom:4px">${e.company}</div>${e.description ? `<div style="font-size:12px;color:#555;line-height:1.6">${e.description}</div>` : ''}</div>`
  ).join('');

  const eduHtml = (d.education || []).map(e =>
    `<div style="margin-bottom:10px"><table style="width:100%;border-collapse:collapse"><tr><td style="font-weight:700;font-size:13px;color:#1a202c">${e.degree}</td><td style="font-size:11px;color:#718096;text-align:right;white-space:nowrap">${e.year}</td></tr></table><div style="font-size:12px;color:#4a5568">${e.institution}${e.gpa ? ` · GPA ${e.gpa}` : ''}</div></div>`
  ).join('');

  const projHtml = (d.projects || []).map(p =>
    `<div style="margin-bottom:10px"><div style="font-weight:700;font-size:13px;color:#1a202c">${p.name}${p.link ? ` <span style="font-size:11px;color:#718096;font-weight:400">${p.link}</span>` : ''}</div>${p.description ? `<div style="font-size:12px;color:#555;line-height:1.5">${p.description}</div>` : ''}</div>`
  ).join('');

  const awardsHtml = (d.awards || []).map(a =>
    `<div style="margin-bottom:8px"><span style="font-weight:700;font-size:13px;color:#1a202c">${a.title}</span>${a.issuer ? ` <span style="font-size:12px;color:#4a5568">· ${a.issuer}</span>` : ''}${a.year ? ` <span style="font-size:11px;color:#718096">${a.year}</span>` : ''}</div>`
  ).join('');

  const profilesHtmlDark = (d.profiles || []).map(p =>
    `<div style="font-size:12px;margin-bottom:4px"><strong style="color:rgba(255,255,255,0.85)">${p.platform}:</strong> <span style="color:rgba(255,255,255,0.6)">${p.url}</span></div>`
  ).join('');
  const profilesHtml = (d.profiles || []).map(p =>
    `<div style="font-size:12px;margin-bottom:4px"><strong style="color:#2d3748">${p.platform}:</strong> <span style="color:#4a5568">${p.url}</span></div>`
  ).join('');

  // ── Slate (modern): dark sidebar left with circular photo, white right ──
  if (d.template === 'modern') {
    const sideSection = (title: string, content: string) =>
      `<div style="margin-bottom:18px"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#ffffff;border-bottom:1px solid rgba(255,255,255,0.25);padding-bottom:5px;margin-bottom:8px">${title}</div>${content}</div>`;
    const mainSection = (title: string, content: string) =>
      `<div style="margin-bottom:18px"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#1a202c;border-bottom:2px solid #2d3748;padding-bottom:5px;margin-bottom:10px">${title}</div>${content}</div>`;
    const langHtml = (d.languages || []).map(l =>
      `<div style="font-size:12px;color:rgba(255,255,255,0.8);margin-bottom:5px">${l.name} <span style="color:#90cdf4;font-size:11px">(${l.level})</span></div>`
    ).join('');
    const skillsList = (d.skills || '').split(',').map(s => s.trim()).filter(Boolean).map(s =>
      `<div style="font-size:12px;color:rgba(255,255,255,0.8);margin-bottom:3px">• ${s}</div>`
    ).join('');
    const interestsList = (d.interests || '').split(',').map(s => s.trim()).filter(Boolean).map(s =>
      `<div style="font-size:12px;color:rgba(255,255,255,0.8);margin-bottom:3px">• ${s}</div>`
    ).join('');
    return `<table style="font-family:'Segoe UI',Arial,sans-serif;width:100%;min-height:297mm;border-collapse:collapse;table-layout:fixed">
      <tr>
        <td style="width:210px;background:#2d3748;padding:28px 16px;vertical-align:top">
          ${pic ? `<div style="text-align:center;margin-bottom:16px;padding-top:4px">${pic}</div>` : ''}
          <div style="font-size:17px;font-weight:800;color:#fff;line-height:1.3;margin-bottom:3px;text-align:${pic ? 'center' : 'left'}">${d.fullName || ''}</div>
          ${d.headline ? `<div style="font-size:11px;color:#90cdf4;font-weight:500;margin-bottom:16px;text-align:${pic ? 'center' : 'left'}">${d.headline}</div>` : '<div style="margin-bottom:16px"></div>'}
          ${sideSection('About Me', d.summary ? `<div style="font-size:12px;color:rgba(255,255,255,0.65);line-height:1.6">${d.summary}</div>` : '')}
          ${sideSection('Contact', `
            ${d.email ? `<div style="font-size:11px;color:rgba(255,255,255,0.65);margin-bottom:5px;word-break:break-all">✉ ${d.email}</div>` : ''}
            ${d.phone ? `<div style="font-size:11px;color:rgba(255,255,255,0.65);margin-bottom:5px">📞 ${d.phone}</div>` : ''}
            ${d.location ? `<div style="font-size:11px;color:rgba(255,255,255,0.65)">📍 ${d.location}</div>` : ''}
          `)}
          ${profilesHtml ? sideSection('Links', `<div style="font-size:11px">${profilesHtmlDark}</div>`) : ''}
          ${skillsList ? sideSection('Skills', skillsList) : ''}
          ${langHtml ? sideSection('Languages', langHtml) : ''}
          ${interestsList ? sideSection('Hobbies', interestsList) : ''}
        </td>
        <td style="padding:28px 24px;vertical-align:top;background:#fff">
          ${expHtml ? mainSection('Work Experience', expHtml) : ''}
          ${eduHtml ? mainSection('Education', eduHtml) : ''}
          ${projHtml ? mainSection('Projects', projHtml) : ''}
          ${awardsHtml ? mainSection('Awards', awardsHtml) : ''}
        </td>
      </tr>
    </table>`;
  }

  // ── Ivory (professional): dark header + photo, sidebar + proficiency, main content ──
  if (d.template === 'professional') {
    const sideSection = (title: string, content: string) =>
      `<div style="margin-bottom:16px">
        <div style="background:#2d3748;border-radius:3px;padding:4px 10px;display:inline-block;margin-bottom:8px">
          <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#fff">${title}</span>
        </div>
        ${content}
      </div>`;
    const mainSection = (title: string, content: string) =>
      `<div style="margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <div style="flex:1;height:1px;background:#cbd5e0"></div>
          <div style="border:1px solid #2d3748;border-radius:3px;padding:3px 10px">
            <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#2d3748">${title}</span>
          </div>
          <div style="flex:1;height:1px;background:#cbd5e0"></div>
        </div>
        ${content}
      </div>`;
    const skillBars = (d.skills || '').split(',').map(s => s.trim()).filter(Boolean).map((s) => {
      return `<div style="margin-bottom:8px"><div style="font-size:11px;color:#4a5568;margin-bottom:3px">${s}</div><div style="width:100%;height:5px;background:#e2e8f0;border-radius:3px"><div style="width:75%;height:100%;background:#2d3748;border-radius:3px"></div></div></div>`;
    }).join('');
    const langHtml = (d.languages || []).map(l =>
      `<div style="font-size:12px;color:#4a5568;margin-bottom:4px">${l.name} <span style="color:#718096;font-size:11px">(${l.level})</span></div>`
    ).join('');
    return `<div style="font-family:'Segoe UI',Arial,sans-serif;color:#222;min-height:297mm;box-sizing:border-box">
      <div style="background:linear-gradient(135deg,#1a202c 60%,#2d3748);padding:24px 28px 20px;position:relative">
        <table style="width:100%;border-collapse:collapse"><tr>
          ${pic ? `<td style="vertical-align:bottom;width:${picSize + 20}px;padding-right:16px">${pic}</td>` : ''}
          <td style="vertical-align:bottom">
            <div style="font-size:24px;font-weight:800;color:#fff;margin-bottom:4px">${d.fullName || ''}</div>
            ${d.headline ? `<div style="font-size:12px;color:rgba(255,255,255,0.65);font-weight:500;letter-spacing:.05em;text-transform:uppercase">${d.headline}</div>` : ''}
          </td>
        </tr></table>
      </div>
      <table style="width:100%;border-collapse:collapse;table-layout:fixed">
        <tr>
          <td style="width:200px;background:#f7fafc;border-right:1px solid #e2e8f0;padding:18px 14px;vertical-align:top">
            ${sideSection('Contact', `
              ${d.email ? `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px"><div style="width:14px;height:14px;border-radius:50%;background:#4a5568;display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;flex-shrink:0">✉</div><div style="font-size:11px;color:#4a5568;word-break:break-all">${d.email}</div></div>` : ''}
              ${d.location ? `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px"><div style="width:14px;height:14px;border-radius:50%;background:#4a5568;display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;flex-shrink:0">📍</div><div style="font-size:11px;color:#4a5568">${d.location}</div></div>` : ''}
              ${d.phone ? `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px"><div style="width:14px;height:14px;border-radius:50%;background:#4a5568;display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;flex-shrink:0">📞</div><div style="font-size:11px;color:#4a5568">${d.phone}</div></div>` : ''}
            `)}
            ${skillBars ? sideSection('Proficiency', skillBars) : ''}
            ${langHtml ? sideSection('Languages', langHtml) : ''}
            ${profilesHtml ? sideSection('Profiles', `<div style="font-size:11px;color:#4a5568">${profilesHtml}</div>`) : ''}
          </td>
          <td style="padding:18px 20px;vertical-align:top;background:#fff">
            ${d.summary ? mainSection('Objective', `<p style="font-size:13px;line-height:1.6;margin:0;color:#4a5568">${d.summary}</p>`) : ''}
            ${expHtml ? mainSection('Professional Experience', expHtml) : ''}
            ${eduHtml ? mainSection('Education', eduHtml) : ''}
            ${projHtml ? mainSection('Projects', projHtml) : ''}
            ${awardsHtml ? mainSection('Awards', awardsHtml) : ''}
            ${d.interests ? mainSection('Interests', `<p style="font-size:13px;margin:0;color:#4a5568">${d.interests}</p>`) : ''}
          </td>
        </tr>
      </table>
    </div>`;
  }

  // ── Prestige (classic): navy header with photo top-right, clean single column ──
  const sec = (title: string, content: string) =>
    `<div style="margin-bottom:18px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <div style="width:4px;height:18px;background:#1a365d;border-radius:2px;flex-shrink:0"></div>
        <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#1a365d">${title}</span>
        <div style="flex:1;height:1px;background:#cbd5e0"></div>
      </div>
      ${content}
    </div>`;
  const langHtml = (d.languages || []).map(l =>
    `<span style="display:inline-block;margin:2px 5px 2px 0;background:#ebf8ff;border:1px solid #bee3f8;border-radius:4px;padding:2px 9px;font-size:12px;color:#2b6cb0">${l.name} <span style="color:#4a5568;font-size:11px">(${l.level})</span></span>`
  ).join('');
  const skillTags = (d.skills || '').split(',').map(s => s.trim()).filter(Boolean).map(s =>
    `<span style="display:inline-block;margin:2px 4px 2px 0;background:#edf2f7;border-radius:4px;padding:3px 10px;font-size:12px;color:#2d3748">${s}</span>`
  ).join('');
  return `<div style="font-family:'Segoe UI',Arial,sans-serif;color:#222;min-height:297mm;box-sizing:border-box">
    <div style="background:linear-gradient(135deg,#1a365d,#2b4c7e);padding:28px 32px 22px">
      <table style="width:100%;border-collapse:collapse"><tr>
        <td style="vertical-align:top">
          <div style="font-size:26px;font-weight:800;color:#fff;margin-bottom:5px;letter-spacing:.02em">${d.fullName || ''}</div>
          ${d.headline ? `<div style="font-size:12px;color:rgba(255,255,255,0.7);font-weight:500;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">${d.headline}</div>` : ''}
          <div style="font-size:12px;color:rgba(255,255,255,0.6);display:flex;gap:16px;flex-wrap:wrap">
            ${d.location ? `<span>📍 ${d.location}</span>` : ''}
            ${d.phone ? `<span>📞 ${d.phone}</span>` : ''}
            ${d.email ? `<span>✉ ${d.email}</span>` : ''}
          </div>
          ${profilesHtmlDark ? `<div style="margin-top:8px;font-size:12px">${profilesHtmlDark}</div>` : ''}
        </td>
        ${pic ? `<td style="vertical-align:top;text-align:right;width:${picSize + 20}px;padding-left:20px">${pic}</td>` : ''}
      </tr></table>
    </div>
    <div style="padding:24px 32px">
      ${d.summary ? sec('Summary', `<p style="font-size:13px;line-height:1.6;margin:0;color:#4a5568">${d.summary}</p>`) : ''}
      ${expHtml ? sec('Experience', expHtml) : ''}
      ${eduHtml ? sec('Education', eduHtml) : ''}
      ${projHtml ? sec('Projects', projHtml) : ''}
      ${skillTags ? sec('Skills', `<div>${skillTags}</div>`) : ''}
      ${langHtml ? sec('Languages', `<div>${langHtml}</div>`) : ''}
      ${d.interests ? sec('Interests', `<p style="font-size:13px;margin:0;color:#4a5568">${d.interests}</p>`) : ''}
      ${awardsHtml ? sec('Awards', awardsHtml) : ''}
    </div>
  </div>`;
}

// ─── Section form fields ─────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 10px', color: '#e0e0e0', fontSize: 13, outline: 'none', boxSizing: 'border-box' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' };
const addBtnStyle: React.CSSProperties = { width: '100%', marginTop: 10, background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.15)', color: '#94a3b8', borderRadius: 8, padding: '8px', cursor: 'pointer', fontSize: 13 };
const removeBtnStyle: React.CSSProperties = { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 11 };

function Field({ label, value, onChange, placeholder, multiline }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />}
    </div>
  );
}

interface SectionContentProps {
  section: string;
  data: CvData;
  update: (field: keyof CvData, value: unknown) => void;
  updateArr: <T>(field: keyof CvData, arr: T[], i: number, key: keyof T, val: string) => void;
  removeArr: <T>(field: keyof CvData, arr: T[], i: number) => void;
  updatePic: (field: keyof PictureSettings, val: unknown) => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function SectionContent({ section, data, update, updateArr, removeArr, updatePic, fileRef }: SectionContentProps) {
  const pic = data.picture || { size: 100, rotation: 0, aspectRatio: '1:1' as const, borderRadius: 50 };

  if (section === 'picture') return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        {pic.dataUrl
          ? <img src={pic.dataUrl} style={{ width: pic.size, height: pic.size, borderRadius: `${pic.borderRadius ?? 50}%`, objectFit: 'cover', transform: `rotate(${pic.rotation}deg)`, display: 'inline-block' }} />
          : <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}><PersonIcon sx={{ fontSize: 36 }} /></div>}
      </div>
      <button onClick={() => fileRef.current?.click()} style={{ ...addBtnStyle, marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><CameraAltIcon sx={{ fontSize: 15 }} /> Upload Photo</button>
      <div style={{ marginTop: 12 }}>
        <label style={labelStyle}>Size ({pic.size}px)</label>
        <input type="range" min={60} max={160} value={pic.size} onChange={e => updatePic('size', +e.target.value)} style={{ width: '100%' }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <label style={labelStyle}>Border Radius ({pic.borderRadius ?? 50}%)</label>
        <input type="range" min={0} max={50} value={pic.borderRadius ?? 50} onChange={e => updatePic('borderRadius', +e.target.value)} style={{ width: '100%' }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <label style={labelStyle}>Rotation ({pic.rotation}°)</label>
        <input type="range" min={-30} max={30} value={pic.rotation} onChange={e => updatePic('rotation', +e.target.value)} style={{ width: '100%' }} />
      </div>
    </div>
  );

  if (section === 'basics') return (
    <div>
      <Field label="Full Name" value={data.fullName} onChange={v => update('fullName', v)} placeholder="Jane Doe" />
      <Field label="Headline" value={data.headline || ''} onChange={v => update('headline', v)} placeholder="Software Engineer" />
      <Field label="Email" value={data.email} onChange={v => update('email', v)} placeholder="jane@example.com" />
      <Field label="Phone" value={data.phone || ''} onChange={v => update('phone', v)} placeholder="+1 555 000 0000" />
      <Field label="Location" value={data.location || ''} onChange={v => update('location', v)} placeholder="City, Country" />
    </div>
  );

  if (section === 'summary') return (
    <Field label="Summary" value={data.summary || ''} onChange={v => update('summary', v)} placeholder="Write a short professional summary..." multiline />
  );

  if (section === 'profiles') {
    const profiles = data.profiles || [];
    return (
      <div>
        {profiles.map((p, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 10, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#64748b', fontSize: 12, fontWeight: 600 }}>Profile {i + 1}</span>
              <button onClick={() => removeArr('profiles', profiles, i)} style={removeBtnStyle}>✕</button>
            </div>
            <Field label="Platform" value={p.platform} onChange={v => updateArr('profiles', profiles, i, 'platform', v)} placeholder="LinkedIn" />
            <Field label="URL" value={p.url} onChange={v => updateArr('profiles', profiles, i, 'url', v)} placeholder="linkedin.com/in/..." />
          </div>
        ))}
        <button onClick={() => update('profiles', [...profiles, { platform: '', url: '' }])} style={addBtnStyle}>+ Add Profile</button>
      </div>
    );
  }

  if (section === 'experience') {
    const exp = data.experience || [];
    return (
      <div>
        {exp.map((e, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 10, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#64748b', fontSize: 12, fontWeight: 600 }}>Job {i + 1}</span>
              <button onClick={() => removeArr('experience', exp, i)} style={removeBtnStyle}>✕</button>
            </div>
            <Field label="Title" value={e.title} onChange={v => updateArr('experience', exp, i, 'title', v)} placeholder="Software Engineer" />
            <Field label="Company" value={e.company} onChange={v => updateArr('experience', exp, i, 'company', v)} placeholder="Acme Corp" />
            <Field label="Duration" value={e.duration} onChange={v => updateArr('experience', exp, i, 'duration', v)} placeholder="Jan 2022 – Present" />
            <Field label="Description" value={e.description || ''} onChange={v => updateArr('experience', exp, i, 'description', v)} placeholder="What you did..." multiline />
          </div>
        ))}
        <button onClick={() => update('experience', [...exp, { title: '', company: '', duration: '', description: '' }])} style={addBtnStyle}>+ Add Experience</button>
      </div>
    );
  }

  if (section === 'education') {
    const edu = data.education || [];
    return (
      <div>
        {edu.map((e, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 10, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#64748b', fontSize: 12, fontWeight: 600 }}>Degree {i + 1}</span>
              <button onClick={() => removeArr('education', edu, i)} style={removeBtnStyle}>✕</button>
            </div>
            <Field label="Degree" value={e.degree} onChange={v => updateArr('education', edu, i, 'degree', v)} placeholder="B.Sc. Computer Science" />
            <Field label="Institution" value={e.institution} onChange={v => updateArr('education', edu, i, 'institution', v)} placeholder="MIT" />
            <Field label="Year" value={e.year} onChange={v => updateArr('education', edu, i, 'year', v)} placeholder="2018 – 2022" />
            <Field label="GPA" value={e.gpa || ''} onChange={v => updateArr('education', edu, i, 'gpa', v)} placeholder="3.8" />
          </div>
        ))}
        <button onClick={() => update('education', [...edu, { degree: '', institution: '', year: '', gpa: '' }])} style={addBtnStyle}>+ Add Education</button>
      </div>
    );
  }

  if (section === 'projects') {
    const projects = data.projects || [];
    return (
      <div>
        {projects.map((p, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 10, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#64748b', fontSize: 12, fontWeight: 600 }}>Project {i + 1}</span>
              <button onClick={() => removeArr('projects', projects, i)} style={removeBtnStyle}>✕</button>
            </div>
            <Field label="Name" value={p.name} onChange={v => updateArr('projects', projects, i, 'name', v)} placeholder="My Project" />
            <Field label="Description" value={p.description || ''} onChange={v => updateArr('projects', projects, i, 'description', v)} placeholder="What it does..." multiline />
            <Field label="Link" value={p.link || ''} onChange={v => updateArr('projects', projects, i, 'link', v)} placeholder="github.com/..." />
          </div>
        ))}
        <button onClick={() => update('projects', [...projects, { name: '', description: '', link: '' }])} style={addBtnStyle}>+ Add Project</button>
      </div>
    );
  }

  if (section === 'skills') return (
    <Field label="Skills (comma-separated)" value={data.skills || ''} onChange={v => update('skills', v)} placeholder="React, TypeScript, Node.js..." multiline />
  );

  if (section === 'languages') {
    const langs = data.languages || [];
    return (
      <div>
        {langs.map((l, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 10, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#64748b', fontSize: 12, fontWeight: 600 }}>Language {i + 1}</span>
              <button onClick={() => removeArr('languages', langs, i)} style={removeBtnStyle}>✕</button>
            </div>
            <Field label="Language" value={l.name} onChange={v => updateArr('languages', langs, i, 'name', v)} placeholder="English" />
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Level</label>
              <select value={l.level} onChange={e => updateArr('languages', langs, i, 'level', e.target.value)} style={{ ...inputStyle }}>
                {['Native', 'Fluent', 'Advanced', 'Intermediate', 'Conversational', 'Basic'].map(lv => <option key={lv} value={lv}>{lv}</option>)}
              </select>
            </div>
          </div>
        ))}
        <button onClick={() => update('languages', [...langs, { name: '', level: 'Conversational' }])} style={addBtnStyle}>+ Add Language</button>
      </div>
    );
  }

  if (section === 'interests') return (
    <Field label="Interests" value={data.interests || ''} onChange={v => update('interests', v)} placeholder="Reading, Hiking, Open Source..." multiline />
  );

  if (section === 'awards') {
    const awards = data.awards || [];
    return (
      <div>
        {awards.map((a, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 10, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#64748b', fontSize: 12, fontWeight: 600 }}>Award {i + 1}</span>
              <button onClick={() => removeArr('awards', awards, i)} style={removeBtnStyle}>✕</button>
            </div>
            <Field label="Title" value={a.title} onChange={v => updateArr('awards', awards, i, 'title', v)} placeholder="Best Paper Award" />
            <Field label="Issuer" value={a.issuer || ''} onChange={v => updateArr('awards', awards, i, 'issuer', v)} placeholder="IEEE" />
            <Field label="Year" value={a.year || ''} onChange={v => updateArr('awards', awards, i, 'year', v)} placeholder="2023" />
          </div>
        ))}
        <button onClick={() => update('awards', [...awards, { title: '', issuer: '', year: '' }])} style={addBtnStyle}>+ Add Award</button>
      </div>
    );
  }

  return null;
}

// ─── Default export (wraps in Suspense for useSearchParams) ──────────────────

export default function BuilderPage() {
  return (
    <Suspense fallback={<div style={{ height: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Loading...</div>}>
      <BuilderInner />
    </Suspense>
  );
}
