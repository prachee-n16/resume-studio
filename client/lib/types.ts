export interface BulletVariant {
  id: string;
  text: string;
}

export interface BulletOption {
  id: string;
  summary: string;
  variants: BulletVariant[];
  tags: string[];
}

export interface Experience {
  id: string;
  company: string;
  location?: string;
  title: string;
  startDate: string;
  endDate: string;
  tags: string[];
  selectedBullets: { optionId: string; variantId: string }[];
  bulletOptions: BulletOption[];
}

export interface Project {
  id: string;
  title: string;
  url: string;
  tags: string[];
  selectedBullets: { optionId: string; variantId: string }[];
  bulletOptions: BulletOption[];
}

export interface Education {
  id: string;
  school: string;
  field: string;
  degree: string;
  graduationDate: string;
  description: string;
}

export interface Skill {
  languages: string[];
  frameworks: string[];
  tools: string[];
  awards: string[];
}

export interface Resume {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill;
  tags: string[];
  lastEdited: string;
}
