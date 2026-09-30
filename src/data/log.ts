import { roles, toMonths, type Role, type YearMonth } from './experience';

export type Lane = 0 | 1;

export interface LogRow {
  kind: 'commit' | 'merge';
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
  /** Merge row: the branch curves out of this node and runs down its own lane. */
  mergeOut: boolean;
  /** Fork parent: the branch lane comes in from above and curves into this node. */
  forkIn: boolean;
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
  kind: 'commit' | 'merge';
  date: YearMonth;
  lane: Lane;
  role?: Role;
  merged?: string;
}

export const buildLog = (list: Role[] = roles): LogRow[] => {
  const events: Event[] = list.map((role) => ({
    kind: 'commit',
    date: role.start,
    lane: role.branch ? 1 : 0,
    role,
  }));
  for (const role of list) {
    if (role.branch && role.end) {
      events.push({ kind: 'merge', date: role.end, lane: 0, merged: role.branch });
    }
  }
  // Newest first, like git log. A merge sorts above a commit from the same month.
  events.sort((a, b) => toMonths(b.date) - toMonths(a.date) || (a.kind === 'merge' ? -1 : 1));

  const mainIdx = events.flatMap((e, i) => (e.lane === 0 ? [i] : []));
  const firstMain = mainIdx[0];
  const lastMain = mainIdx[mainIdx.length - 1];

  // Where the branch lane is alive, in display order: merge row → branch commit → fork parent.
  const mergeAt = events.findIndex((e) => e.kind === 'merge');
  const branchAt = events.findIndex((e) => e.lane === 1);
  const forkAt = branchAt === -1 ? -1 : events.findIndex((e, i) => i > branchAt && e.lane === 0);

  return events.map((e, i) => {
    const onBranch = e.lane === 1;
    const through: Lane[] = [];
    if (onBranch) {
      if (i > firstMain && i < lastMain) through.push(0);
    } else if (branchAt !== -1) {
      const aboveBranch = mergeAt !== -1 && i > mergeAt && i < branchAt;
      const belowBranch = i > branchAt && i < forkAt;
      if (aboveBranch || belowBranch) through.push(1);
    }

    const seed = e.role ? `${e.role.company}|${e.role.start}` : `merge|${e.merged}|${e.date}`;

    return {
      kind: e.kind,
      hash: shortHash(seed),
      date: e.date,
      lane: e.lane,
      role: e.role,
      merged: e.merged,
      head: i === firstMain && e.role?.end === null,
      top: onBranch ? mergeAt !== -1 && i > mergeAt : i > firstMain,
      bottom: onBranch ? forkAt !== -1 : i < lastMain,
      through,
      mergeOut: i === mergeAt,
      forkIn: i === forkAt,
    };
  });
};

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** "3 år 2 mdr", "7 mdr". */
export const duration = (start: YearMonth, end: YearMonth): string => {
  const months = toMonths(end) - toMonths(start);
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y} år`, m && plural(m, 'md', 'mdr')].filter(Boolean).join(' ');
};
