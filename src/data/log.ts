import { education, roles, toMonths, type Role, type YearMonth } from './experience';
import { profile } from './profile';

/** 0 is main. Each parallel branch runs in its own lane to the right. */
export type Lane = number;

export interface LogRow {
  kind: 'commit' | 'merge' | 'root';
  hash: string;
  date: YearMonth;
  lane: Lane;
  role?: Role;
  /** Merge rows: the branch that was merged. */
  merged?: string;
  head: boolean;
  /** Line into the node from above / out of the node below, on the node's own lane. */
  top: boolean;
  bottom: boolean;
  /** Other lanes passing straight through the row. */
  through: Lane[];
  /** Merge row: the lane the merged branch curves out to and runs down. */
  mergeOut?: Lane;
  /** Fork parent: the branch lanes that come in from above and curve into this node. */
  forkIn: Lane[];
}

/** FNV-1a, rendered as a 7-char short hash. Stable across builds. */
const shortHash = (input: string): string => {
  let h = 0x811c9dc5;
  for (const ch of input) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
};

interface Event {
  kind: LogRow['kind'];
  date: YearMonth;
  /** Commits: the branch the role ran on. Merges: the branch merged. */
  branch?: string;
  role?: Role;
}

/** One role per branch. Row indices in display order: merge row → branch commit → fork parent. */
interface Span {
  name: string;
  merge: number;
  at: number;
  fork: number;
  lane: Lane;
}

export const buildLog = (list: Role[] = [...roles, ...education], born: YearMonth | null = profile.born): LogRow[] => {
  const events: Event[] = list.map((role) => ({ kind: 'commit', date: role.start, branch: role.branch, role }));
  for (const role of list) {
    if (role.branch && role.end) {
      events.push({ kind: 'merge', date: role.end, branch: role.branch });
    }
  }
  // Newest first, like git log. A merge sorts above a commit from the same month.
  events.sort((a, b) => toMonths(b.date) - toMonths(a.date) || (a.kind === 'merge' ? -1 : 1));
  if (born) events.push({ kind: 'root', date: born });

  const onMain = (e: Event) => e.kind !== 'commit' || !e.branch;
  const mainIdx = events.flatMap((e, i) => (onMain(e) ? [i] : []));
  const firstMain = mainIdx[0];
  const lastMain = mainIdx[mainIdx.length - 1];

  const spans: Span[] = events.flatMap((e, at) => {
    if (onMain(e)) return [];
    const name = e.branch!;
    const merge = events.findIndex((m) => m.kind === 'merge' && m.branch === name);
    const fork = events.findIndex((f, i) => i > at && onMain(f));
    return [{ name, merge, at, fork, lane: 0 }];
  });

  // Like git's columns: top-down, a branch takes the lowest lane free for its whole span.
  const opens = (s: Span) => (s.merge === -1 ? s.at : s.merge);
  const closes = (s: Span) => (s.fork === -1 ? s.at : s.fork);
  for (const s of [...spans].sort((a, b) => opens(a) - opens(b))) {
    const busy = spans.filter((o) => o.lane && opens(o) <= closes(s) && opens(s) <= closes(o)).map((o) => o.lane);
    s.lane = 1;
    while (busy.includes(s.lane)) s.lane++;
  }

  return events.map((e, i) => {
    const own = spans.find((s) => s.at === i);
    const through: Lane[] = [];
    if (own && i > firstMain && i < lastMain) through.push(0);
    for (const s of spans) {
      const aboveBranch = s.merge !== -1 && i > s.merge && i < s.at;
      const belowBranch = i > s.at && i < s.fork;
      if (aboveBranch || belowBranch) through.push(s.lane);
    }

    const seed = e.role
      ? `${e.role.company}|${e.role.start}`
      : e.kind === 'merge'
        ? `merge|${e.branch}|${e.date}`
        : `root|${e.date}`;

    return {
      kind: e.kind,
      hash: shortHash(seed),
      date: e.date,
      lane: own?.lane ?? 0,
      role: e.role,
      merged: e.kind === 'merge' ? e.branch : undefined,
      head: i === firstMain && e.role?.end === null,
      top: own ? own.merge !== -1 && i > own.merge : i > firstMain,
      bottom: own ? own.fork !== -1 : i < lastMain,
      through,
      mergeOut: spans.find((s) => s.merge === i)?.lane,
      forkIn: spans.filter((s) => s.fork === i).map((s) => s.lane),
    };
  });
};

/** `git blame`: the role commit a line written in month `at` sits on. The newest on main from then, else any. */
export const blameAt = (at: YearMonth, rows: LogRow[] = buildLog()): LogRow => {
  const done = rows.filter((r) => r.role && toMonths(r.role.start) <= toMonths(at));
  return done.find((r) => r.lane === 0) ?? done[0] ?? rows[rows.length - 1];
};

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** "3 år 2 mdr", "7 mdr". Empty when a bare year leaves the length unknown. */
export const duration = (start: YearMonth, end: YearMonth): string => {
  if (!start.includes('-') || !end.includes('-')) return '';
  const months = toMonths(end) - toMonths(start);
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y} år`, m && plural(m, 'md', 'mdr')].filter(Boolean).join(' ');
};
