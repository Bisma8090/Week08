import { CreateCvDto } from './dto/create-cv.dto';
export declare class CvService {
    save(dto: CreateCvDto): {
        id: string;
    };
    findOne(id: string): CreateCvDto | undefined;
    buildHtml(dto: CreateCvDto): string;
    private classicHtml;
    private modernHtml;
    private professionalHtml;
    generatePdf(dto: CreateCvDto): Promise<Buffer>;
}
