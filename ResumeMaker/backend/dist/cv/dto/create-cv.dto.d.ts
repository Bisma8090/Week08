export declare class EducationDto {
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
}
export declare class ExperienceDto {
    title: string;
    company: string;
    duration: string;
    description?: string;
}
export declare class CreateCvDto {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    summary?: string;
    skills?: string;
    template?: string;
    education?: EducationDto[];
    experience?: ExperienceDto[];
}
