import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter: (_, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new BadRequestException(`Invalid file type: ${file.mimetype}. Only PDF files are accepted.`), false);
      }
    },
  }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Only PDF files are accepted.');
    return this.documentsService.uploadAndAnalyze(file);
  }

  @Get()
  async list() {
    return this.documentsService.listDocuments();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.documentsService.getDocument(id);
  }

  @Post(':id/summarize')
  async summarize(@Param('id') id: string) {
    return this.documentsService.summarize(id);
  }

  @Post(':id/ask')
  async ask(@Param('id') id: string, @Body() body: { question: string }) {
    return this.documentsService.askQuestion(id, body.question);
  }
}
