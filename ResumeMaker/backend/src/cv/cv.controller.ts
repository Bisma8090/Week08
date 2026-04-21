import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post('save')
  save(@Body() dto: CreateCvDto) {
    return this.cvService.save(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cvService.findOne(id);
  }

  @Post('pdf')
  async downloadPdf(@Body() dto: CreateCvDto, @Res() res: Response) {
    const pdf = await this.cvService.generatePdf(dto);
    const filename = `${dto.fullName.replace(/\s+/g, '_')}_CV.pdf`;
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdf.length,
    });
    res.end(pdf);
  }

  @Post('preview')
  preview(@Body() dto: CreateCvDto) {
    return { html: this.cvService.buildHtml(dto) };
  }
}
