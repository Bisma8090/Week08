import type { Response } from 'express';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
export declare class CvController {
    private readonly cvService;
    constructor(cvService: CvService);
    save(dto: CreateCvDto): {
        id: string;
    };
    findOne(id: string): CreateCvDto | undefined;
    downloadPdf(dto: CreateCvDto, res: Response): Promise<void>;
    preview(dto: CreateCvDto): {
        html: string;
    };
}
