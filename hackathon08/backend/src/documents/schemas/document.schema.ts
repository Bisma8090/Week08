import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DocumentDocument = PdfDocument & Document;

@Schema({ timestamps: true })
export class PdfDocument {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  fullText: string;

  @Prop()
  documentType: string;

  @Prop({ type: [String] })
  sections: string[];

  @Prop({ type: [String] })
  themes: string[];

  @Prop({ type: [String] })
  entities: string[];

  @Prop()
  summary: string;

  @Prop({ type: [String] })
  highlights: string[];

  @Prop({ default: 'pending' })
  status: string; // pending | analyzed
}

export const PdfDocumentSchema = SchemaFactory.createForClass(PdfDocument);
