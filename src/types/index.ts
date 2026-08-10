export interface Topic {
  name: string;
  slug: string;
  desc: string;
}

export interface Chapter {
  id: string;
  title: string;
  topics: Topic[];
}

export interface SkillData {
  title: string;
  icon: string;
  color: string;
  description: string;
  chapters: Chapter[];
}

export interface CurriculumData {
  [key: string]: SkillData;
}

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export interface NoteData {
  title: string;
  category: string;
  chapterId: string;
  slug: string;
  description: string;
  playgroundTemplate?: string;
  contentHtml: string;
  headings: Heading[];
  firstCodeBlock?: string;
}
