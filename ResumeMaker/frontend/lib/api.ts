import { CvData } from '@/types/cv';

const BASE = 'http://localhost:3001/api/cv';

export async function saveCv(data: CvData): Promise<{ id: string }> {
  const res = await fetch(`${BASE}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getPreviewHtml(data: CvData): Promise<string> {
  const res = await fetch(`${BASE}/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.html;
}

export async function downloadPdf(data: CvData): Promise<void> {
  const res = await fetch(`${BASE}/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.fullName.replace(/\s+/g, '_')}_CV.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
