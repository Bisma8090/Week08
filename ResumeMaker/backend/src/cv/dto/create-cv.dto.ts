import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class EducationDto {
  @IsString() degree: string;
  @IsString() institution: string;
  @IsString() year: string;
  @IsOptional() @IsString() gpa?: string;
}

export class ExperienceDto {
  @IsString() title: string;
  @IsString() company: string;
  @IsString() duration: string;
  @IsOptional() @IsString() description?: string;
}

export class CreateCvDto {
  @IsString() fullName: string;
  @IsString() email: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() linkedin?: string;
  @IsOptional() @IsString() summary?: string;
  @IsOptional() @IsString() skills?: string;
  @IsOptional() @IsString() template?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  education?: EducationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  experience?: ExperienceDto[];
}
