import { profile } from './profile';

export type Lang = 'da' | 'en';

export const langs: Lang[] = ['da', 'en'];

export type Block = { p: string } | { list: { term?: string; text: string }[] };

export interface Section {
  heading: string;
  /** Paragraphs may hold inline links, so they are rendered as HTML. */
  blocks: Block[];
}

export interface PrivacyPolicy {
  /** The language's own name, for the language switch. */
  name: string;
  title: string;
  description: string;
  updated: string;
  lead: string;
  intro: string;
  sections: Section[];
}

export const mail = `<a href="mailto:${profile.email}">${profile.email}</a>`;
