"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CvController = void 0;
const common_1 = require("@nestjs/common");
const cv_service_1 = require("./cv.service");
const create_cv_dto_1 = require("./dto/create-cv.dto");
let CvController = class CvController {
    cvService;
    constructor(cvService) {
        this.cvService = cvService;
    }
    save(dto) {
        return this.cvService.save(dto);
    }
    findOne(id) {
        return this.cvService.findOne(id);
    }
    async downloadPdf(dto, res) {
        const pdf = await this.cvService.generatePdf(dto);
        const filename = `${dto.fullName.replace(/\s+/g, '_')}_CV.pdf`;
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': pdf.length,
        });
        res.end(pdf);
    }
    preview(dto) {
        return { html: this.cvService.buildHtml(dto) };
    }
};
exports.CvController = CvController;
__decorate([
    (0, common_1.Post)('save'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cv_dto_1.CreateCvDto]),
    __metadata("design:returntype", void 0)
], CvController.prototype, "save", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CvController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('pdf'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cv_dto_1.CreateCvDto, Object]),
    __metadata("design:returntype", Promise)
], CvController.prototype, "downloadPdf", null);
__decorate([
    (0, common_1.Post)('preview'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cv_dto_1.CreateCvDto]),
    __metadata("design:returntype", void 0)
], CvController.prototype, "preview", null);
exports.CvController = CvController = __decorate([
    (0, common_1.Controller)('cv'),
    __metadata("design:paramtypes", [cv_service_1.CvService])
], CvController);
//# sourceMappingURL=cv.controller.js.map