export interface Experience {
  id: number;
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  bullets: string[];
  tags: string[];
}

export interface StackItem {
  name: string;
  highlight: boolean;
}

export interface StackGroup {
  label: string;
  items: StackItem[];
}

export interface Project {
  id: number;
  num: string;
  name: string;
  desc: string;
  tags: string[];
  url: string;
}

export interface Language {
  flag: string;
  lang: string;
  level: string;
}