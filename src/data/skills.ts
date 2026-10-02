import { education, roles, techName, toMonths, type Role } from './experience';

/** A diffstat line. `from` when it counts several tech names as one, like TypeScript and the JavaScript before it. */
export type Featured = string | { name: string; from: string[] };

/** The diffstat, in this order: what Daniel works with today. Every name must be in some role's `tech`. */
export const featured: Featured[] = [
  'C# / .NET',
  { name: 'TypeScript / JavaScript', from: ['TypeScript', 'JavaScript'] },
  'Umbraco',
  'Angular',
  'Azure',
  { name: 'Databaser', from: ['SQL Server', 'Cosmos DB', 'PostgreSQL', 'RavenDB'] },
  { name: 'Søgning', from: ['Lucene', 'Elasticsearch', 'Algolia'] },
  'Docker',
  { name: 'DevOps', from: ['Azure DevOps', 'GitHub Actions'] },
  'HTML & CSS',
  'Aspire',
  'Generative AI',
  'RAG & Vector Search',
];

export interface SkillStat {
  name: string;
  /** The tech names it counts, for filtering the log. */
  from: string[];
  /** Months in stretches that have ended. */
  closed: number;
  /** Month count (as `toMonths`) where the stretch still running began, if any. */
  openFrom?: number;
}

/** Time with each skill: the union of every role that lists it, so parallel roles count once. */
export const buildStats = (list: Role[] = [...roles, ...education], entries: Featured[] = featured): SkillStat[] =>
  entries.map((entry) => {
    const { name, from } = typeof entry === 'string' ? { name: entry, from: [entry] } : entry;
    const spans = list
      .flatMap((role) =>
        (role.tech ?? [])
          .filter((t) => from.includes(techName(t)))
          .map((tech) => {
            const since = typeof tech === 'string' ? role.start : tech.since;
            const start = Math.max(toMonths(role.start), toMonths(since));
            return { start, end: role.end ? toMonths(role.end) : Infinity };
          }),
      )
      .sort((a, b) => a.start - b.start);
    if (!spans.length) throw new Error(`Skill "${name}" is in no role's tech`);

    let closed = 0;
    let run = { ...spans[0] };
    for (const span of spans.slice(1)) {
      if (span.start <= run.end) {
        run.end = Math.max(run.end, span.end);
      } else {
        closed += run.end - run.start;
        run = { ...span };
      }
    }
    if (run.end !== Infinity) return { name, from, closed: closed + run.end - run.start };
    return { name, from, closed, openFrom: run.start };
  });

/** Months with a skill as of `now`. */
export const monthsOf = (stat: SkillStat, now: Date): number =>
  stat.closed + (stat.openFrom === undefined ? 0 : now.getFullYear() * 12 + now.getMonth() - stat.openFrom);
