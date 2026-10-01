/** Year-month as `YYYY-MM`. A bare `YYYY` when only the year is known, `YYYY-MM-DD` for a single day. */
export type YearMonth = `${number}-${string}` | `${number}`;

/** A technology on a role. `since` when it came in partway through the role. */
export type Tech = string | { name: string; since: YearMonth };

export const techName = (t: Tech): string => (typeof t === 'string' ? t : t.name);

export interface Role {
  company: string;
  title: string;
  start: YearMonth;
  /** `null` while the role is current. */
  end: YearMonth | null;
  url?: string;
  summary?: string;
  /** Set when the role ran in parallel with the main line: drawn as its own branch. */
  branch?: string;
  /** Printed as a `Tech:` trailer, and the source of the skills diffstat. */
  tech?: Tech[];
}

/** Newest first. Source: the previous danieltoft.dk. */
export const roles: Role[] = [
  {
    company: 'ILLUMI A/S',
    title: 'Software Architect',
    start: '2016-06',
    end: null,
    url: 'https://www.illumi.dk',
    tech: [
      'C# / .NET',
      'TypeScript',
      'Angular',
      'HTML & CSS',
      'Azure',
      { name: 'Kubernetes', since: '2020' },
      'DevOps',
      { name: 'Aspire', since: '2023-11' },
      { name: 'AI', since: '2023' },
    ],
  },
  {
    company: 'NöRD A/S',
    title: 'System Developer',
    start: '2013-04',
    end: '2016-06',
    summary: 'Backend i .NET, ASP.NET MVC og Umbraco, plus frontend i JavaScript.',
    tech: ['C# / .NET', 'Umbraco', 'Angular', 'JavaScript', 'HTML & CSS'],
  },
  {
    company: 'Brinth & Hillerup A/S',
    title: 'Lead Developer',
    start: '2012-09',
    end: '2013-04',
    summary: 'Scandia Housings website på Umbraco og deres forretningssystemer.',
    tech: ['C# / .NET', 'Umbraco', 'JavaScript', 'HTML & CSS'],
  },
  {
    company: 'SystemaWeb',
    title: 'Owner & Developer',
    start: '2009-06',
    end: '2013-01',
    branch: 'systemaweb',
    summary: 'Egen virksomhed. Fra IT-support til web og software på Umbraco og Drupal, også som freelancer.',
    tech: [ 'C# / .NET', 'Umbraco', 'Drupal', 'PHP', 'Javascript', 'HTML & CSS'],
  },
  {
    company: 'Bang & Olufsen R&D',
    title: 'Software Developer, lærling',
    start: '2011-06',
    end: '2012-10',
    tech: [ 'C# / .NET', 'WinForms'],
    summary: 'Et værktøj til projektstyring i udviklingsafdelingen.',
  },
  {
    company: 'Bang & Olufsen R&D',
    title: 'Software Developer, lærling',
    start: '2010-04',
    end: '2011-06',
    summary: 'Automatiseret testmiljø til B&O’s TV-platform og teststrategier.',
    tech: ['C# / .NET', 'Python', 'C'],
  },
  {
    company: 'Bang & Olufsen IT',
    title: 'Systemkonsulent, lærling',
    start: '2008-05',
    end: '2010-04',
    tech: ['C# / .NET', 'Serverteknologi', 'Netværk'],
    summary: 'Serverinfrastruktur og mindre applikationer til internt og eksternt brug.',
  },
];

/** Newest first. Schools reuse `Role`: `company` is the school, `title` the degree. Source: LinkedIn, which gives years only. */
export const education: Role[] = [
  {
    company: 'Tech College Aalborg',
    title: 'Datatekniker, speciale i programmering',
    summary: 'Netværk, serverteknologi og programmering.',
    start: '2006',
    end: '2012',
    branch: 'uddannelse',
  },
];

/** Months since epoch-ish, for layout math. A bare year counts from January. */
export const toMonths = (ym: YearMonth): number => {
  const [y, m = 1] = ym.split('-').map(Number);
  return y * 12 + (m - 1);
};

const MONTHS_DA = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

/** "2006", "jun 2016" or "20. aug 1989": only as precise as the date itself. */
export const formatYM = (ym: YearMonth): string => {
  const [y, m, d] = ym.split('-').map(Number);
  if (!m) return String(y);
  return `${d ? `${d}. ` : ''}${MONTHS_DA[m - 1]} ${y}`;
};
