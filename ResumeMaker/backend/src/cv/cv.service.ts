import { Injectable } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';

// In-memory store (replace with DB later)
const cvStore: Map<string, CreateCvDto> = new Map();

@Injectable()
export class CvService {
  save(dto: CreateCvDto): { id: string } {
    const id = Date.now().toString();
    cvStore.set(id, dto);
    return { id };
  }

  findOne(id: string): CreateCvDto | undefined {
    return cvStore.get(id);
  }

  buildHtml(dto: CreateCvDto): string {
    const template = dto.template || 'classic';
    const skills = (dto.skills || '').split(',').filter(Boolean);
    const eduHtml = (dto.education || []).map(e => `
      <div class="entry">
        <div class="entry-header"><span class="entry-title">${e.degree}</span><span class="entry-date">${e.year}</span></div>
        <div class="entry-sub">${e.institution}${e.gpa ? ` — GPA: ${e.gpa}` : ''}</div>
      </div>`).join('');

    const expHtml = (dto.experience || []).map(e => {
      const bullets = (e.description || '').split('\n').filter(Boolean)
        .map(l => `<li>${l.replace(/^[•\-\*]\s*/, '')}</li>`).join('');
      return `
      <div class="entry">
        <div class="entry-header"><span class="entry-title">${e.title}</span><span class="entry-date">${e.duration}</span></div>
        <div class="entry-sub">${e.company}</div>
        ${bullets ? `<ul>${bullets}</ul>` : ''}
      </div>`;
    }).join('');

    const templates: Record<string, string> = {
      classic: this.classicHtml(dto, skills, eduHtml, expHtml),
      modern: this.modernHtml(dto, skills, eduHtml, expHtml),
      professional: this.professionalHtml(dto, skills, eduHtml, expHtml),
    };

    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; }
      .entry { margin-bottom: 10px; }
      .entry-header { display:flex; justify-content:space-between; }
      .entry-title { font-weight:700; font-size:12px; }
      .entry-date { color:#888; font-size:10px; }
      .entry-sub { color:#555; font-size:11px; margin:2px 0 4px; }
      ul { padding-left:16px; color:#444; line-height:1.6; }
    </style>
    </head><body>${templates[template] || templates.classic}</body></html>`;
  }

  private classicHtml(dto: CreateCvDto, skills: string[], edu: string, exp: string) {
    return `
    <div style="background:#1a1a2e;color:white;padding:28px;text-align:center">
      <h1 style="font-size:22px;margin-bottom:4px">${dto.fullName}</h1>
      <div style="color:#a5b4fc;font-size:12px;margin-bottom:10px">${dto.experience?.[0]?.title || ''}</div>
      <div style="display:flex;justify-content:center;gap:16px;font-size:10px;color:#cbd5e1;flex-wrap:wrap">
        ${dto.email ? `<span>✉ ${dto.email}</span>` : ''}
        ${dto.phone ? `<span>📞 ${dto.phone}</span>` : ''}
        ${dto.location ? `<span>📍 ${dto.location}</span>` : ''}
        ${dto.linkedin ? `<span>🔗 ${dto.linkedin}</span>` : ''}
      </div>
    </div>
    <div style="padding:20px">
      ${dto.summary ? `<div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#1a1a2e;border-bottom:2px solid #1a1a2e;padding-bottom:3px;margin:14px 0 8px">Summary</div><p style="color:#555;line-height:1.6">${dto.summary}</p>` : ''}
      ${exp ? `<div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#1a1a2e;border-bottom:2px solid #1a1a2e;padding-bottom:3px;margin:14px 0 8px">Experience</div>${exp}` : ''}
      ${edu ? `<div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#1a1a2e;border-bottom:2px solid #1a1a2e;padding-bottom:3px;margin:14px 0 8px">Education</div>${edu}` : ''}
      ${skills.length ? `<div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#1a1a2e;border-bottom:2px solid #1a1a2e;padding-bottom:3px;margin:14px 0 8px">Skills</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">${skills.map(s => `<span style="background:#eef2ff;color:#4f46e5;padding:2px 10px;border-radius:20px;font-size:10px">${s.trim()}</span>`).join('')}</div>` : ''}
    </div>`;
  }

  private modernHtml(dto: CreateCvDto, skills: string[], edu: string, exp: string) {
    return `
    <div style="display:flex;min-height:100vh">
      <div style="width:35%;background:#0f3460;color:white;padding:24px 16px">
        <div style="font-size:16px;font-weight:700;margin-bottom:4px">${dto.fullName}</div>
        <div style="color:#93c5fd;font-size:11px;margin-bottom:16px">${dto.experience?.[0]?.title || ''}</div>
        <div style="font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#93c5fd;border-bottom:1px solid #1e4080;padding-bottom:3px;margin-bottom:8px">Contact</div>
        ${dto.email ? `<div style="font-size:10px;color:#cbd5e1;margin-bottom:4px">✉ ${dto.email}</div>` : ''}
        ${dto.phone ? `<div style="font-size:10px;color:#cbd5e1;margin-bottom:4px">📞 ${dto.phone}</div>` : ''}
        ${dto.location ? `<div style="font-size:10px;color:#cbd5e1;margin-bottom:4px">📍 ${dto.location}</div>` : ''}
        ${dto.linkedin ? `<div style="font-size:10px;color:#cbd5e1;margin-bottom:4px">🔗 ${dto.linkedin}</div>` : ''}
        ${skills.length ? `
        <div style="font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#93c5fd;border-bottom:1px solid #1e4080;padding-bottom:3px;margin:14px 0 8px">Skills</div>
        ${skills.map(s => `<div style="font-size:10px;color:#e2e8f0;margin-bottom:2px">${s.trim()}</div><div style="background:#1e4080;border-radius:10px;height:4px;margin-bottom:6px"><div style="background:#60a5fa;height:4px;border-radius:10px;width:80%"></div></div>`).join('')}` : ''}
        ${edu ? `<div style="font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#93c5fd;border-bottom:1px solid #1e4080;padding-bottom:3px;margin:14px 0 8px">Education</div>${edu.replace(/color:#555/g, 'color:#cbd5e1').replace(/color:#888/g, 'color:#93c5fd')}` : ''}
      </div>
      <div style="flex:1;padding:24px 20px;background:white">
        ${dto.summary ? `<div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#0f3460;border-bottom:2px solid #0f3460;padding-bottom:3px;margin-bottom:8px">Summary</div><p style="color:#555;line-height:1.6;margin-bottom:12px">${dto.summary}</p>` : ''}
        ${exp ? `<div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#0f3460;border-bottom:2px solid #0f3460;padding-bottom:3px;margin-bottom:8px">Experience</div>${exp}` : ''}
      </div>
    </div>`;
  }

  private professionalHtml(dto: CreateCvDto, skills: string[], edu: string, exp: string) {
    return `
    <div style="display:flex;min-height:100vh">
      <div style="width:35%;background:#2d6a4f;color:white;padding:24px 16px">
        <div style="font-size:16px;font-weight:700;margin-bottom:4px">${dto.fullName}</div>
        <div style="color:#a7f3d0;font-size:11px;margin-bottom:16px">${dto.experience?.[0]?.title || ''}</div>
        <div style="font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#a7f3d0;border-bottom:1px solid #1b4332;padding-bottom:3px;margin-bottom:8px">Contact</div>
        ${dto.email ? `<div style="font-size:10px;color:#d1fae5;margin-bottom:4px">✉ ${dto.email}</div>` : ''}
        ${dto.phone ? `<div style="font-size:10px;color:#d1fae5;margin-bottom:4px">📞 ${dto.phone}</div>` : ''}
        ${dto.location ? `<div style="font-size:10px;color:#d1fae5;margin-bottom:4px">📍 ${dto.location}</div>` : ''}
        ${dto.linkedin ? `<div style="font-size:10px;color:#d1fae5;margin-bottom:4px">🔗 ${dto.linkedin}</div>` : ''}
        ${skills.length ? `
        <div style="font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#a7f3d0;border-bottom:1px solid #1b4332;padding-bottom:3px;margin:14px 0 8px">Skills</div>
        <div style="display:flex;flex-wrap:wrap;gap:4px">${skills.map(s => `<span style="background:#1b4332;color:#a7f3d0;padding:2px 8px;border-radius:4px;font-size:9px">${s.trim()}</span>`).join('')}</div>` : ''}
        ${edu ? `<div style="font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#a7f3d0;border-bottom:1px solid #1b4332;padding-bottom:3px;margin:14px 0 8px">Education</div>${edu.replace(/color:#555/g, 'color:#d1fae5').replace(/color:#888/g, 'color:#a7f3d0')}` : ''}
      </div>
      <div style="flex:1;padding:24px 20px;background:white">
        ${dto.summary ? `<div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#2d6a4f;border-bottom:2px solid #2d6a4f;padding-bottom:3px;margin-bottom:8px">Summary</div><p style="color:#555;line-height:1.6;margin-bottom:12px">${dto.summary}</p>` : ''}
        ${exp ? `<div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#2d6a4f;border-bottom:2px solid #2d6a4f;padding-bottom:3px;margin-bottom:8px">Experience</div>${exp}` : ''}
      </div>
    </div>`;
  }

  async generatePdf(dto: CreateCvDto): Promise<Buffer> {
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.default.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(this.buildHtml(dto), { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return Buffer.from(pdf);
  }
}
