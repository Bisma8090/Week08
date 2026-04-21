export interface Education {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description?: string;
}

export interface Project {
  name: string;
  description?: string;
  link?: string;
}

export interface Profile {
  platform: string;
  url: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface Award {
  title: string;
  issuer?: string;
  year?: string;
}

export interface PictureSettings {
  dataUrl?: string;
  size: number;
  rotation: number;
  aspectRatio: '1:1' | '3:4' | '4:3';
  borderRadius: number;
}

export interface CvData {
  // Picture
  picture?: PictureSettings;
  // Basics
  fullName: string;
  headline?: string;
  email: string;
  phone?: string;
  location?: string;
  // Summary
  summary?: string;
  // Profiles
  profiles?: Profile[];
  // Experience
  experience?: Experience[];
  // Education
  education?: Education[];
  // Projects
  projects?: Project[];
  // Skills
  skills?: string;
  // Languages
  languages?: Language[];
  // Interests
  interests?: string;
  // Awards
  awards?: Award[];
  // Template
  template?: 'classic' | 'modern' | 'professional';
}
