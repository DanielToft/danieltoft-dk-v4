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
  /** Stretches with the skill as `toMonths` counts, merged where roles overlap, oldest first. `end` is `null` while it runs. */
  runs: { start: number; end: number | null }[];
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

    const runs = [{ ...spans[0] }];
    for (const span of spans.slice(1)) {
      const run = runs[runs.length - 1];
      if (span.start <= run.end) run.end = Math.max(run.end, span.end);
      else runs.push({ ...span });
    }
    // `null`, not `Infinity`: the stats are island props, and those go through JSON.
    return { name, from, runs: runs.map(({ start, end }) => ({ start, end: end === Infinity ? null : end })) };
  });

/** Months with a skill as of `at` (a `toMonths` count). Zero before it began. */
export const monthsAt = (stat: SkillStat, at: number): number =>
  stat.runs.reduce((sum, { start, end }) => sum + Math.max(0, Math.min(end ?? at, at) - start), 0);

/** Months with a skill as of `now`. */
export const monthsOf = (stat: SkillStat, now: Date): number => monthsAt(stat, now.getFullYear() * 12 + now.getMonth());
