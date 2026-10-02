import { education, roles, techName, toMonths, type Role } from './experience';

/** The diffstat, in this order: what Daniel works with today. Every name must be in some role's `tech`. */
export const featured = ['C# / .NET', 'TypeScript', 'Angular', 'Umbraco', 'Azure', 'DevOps', 'HTML & CSS', 'Aspire', 'Generative AI', 'RAG & Vector Search'];

export interface SkillStat {
  name: string;
  /** Months in stretches that have ended. */
  closed: number;
  /** Month count (as `toMonths`) where the stretch still running began, if any. */
  openFrom?: number;
}

/** Time with each skill: the union of every role that lists it, so parallel roles count once. */
export const buildStats = (list: Role[] = [...roles, ...education], names: string[] = featured): SkillStat[] =>
  names.map((name) => {
    const spans = list
      .flatMap((role) => {
        const tech = role.tech?.find((t) => techName(t) === name);
        if (!tech) return [];
        const from = typeof tech === 'string' ? role.start : tech.since;
        const start = Math.max(toMonths(role.start), toMonths(from));
        return [{ start, end: role.end ? toMonths(role.end) : Infinity }];
      })
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
    if (run.end !== Infinity) return { name, closed: closed + run.end - run.start };
    return { name, closed, openFrom: run.start };
  });

/** Months with a skill as of `now`. */
export const monthsOf = (stat: SkillStat, now: Date): number =>
  stat.closed + (stat.openFrom === undefined ? 0 : now.getFullYear() * 12 + now.getMonth() - stat.openFrom);
