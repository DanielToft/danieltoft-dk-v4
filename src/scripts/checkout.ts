/**
 * `git checkout`: the page as it stood at an earlier point in the log. One module-level state that the
 * islands and the static markup all read; `null` is HEAD on main, the page as built.
 */

/** A row of the log the page can be checked out at. */
export interface Commit {
  hash: string;
  /** Its date, as a `toMonths` count. */
  at: number;
  lane: number;
  /** What git prints after the hash: the company, or the merge message. */
  subject: string;
  /** The role the commit starts, with its run as `toMonths` counts. `end` is `null` while it runs. */
  role?: { label: string; start: number; end: number | null };
}

export interface Checkout {
  /** The commit HEAD is detached at. */
  hash: string;
  /** The month the page shows, as a `toMonths` count. Past the commit when scrubbing between two. */
  at: number;
  /** How the checkout was spelled: the hash, or `main@{2014-03}` from the time slider. */
  ref: string;
}

const EVENT = 'checkout';
let current: Checkout | null = null;

export const detached = (): Checkout | null => current;

export const checkout = (next: Checkout | null) => {
  current = next;
  document.documentElement.toggleAttribute('data-detached', next !== null);
  dispatchEvent(new CustomEvent<Checkout | null>(EVENT, { detail: next }));
};

/** Calls `fn` on every checkout, including `git switch main`. Returns the unsubscribe. */
export const onCheckout = (fn: (next: Checkout | null) => void) => {
  const listener = (event: Event) => fn((event as CustomEvent<Checkout | null>).detail);
  addEventListener(EVENT, listener);
  return () => removeEventListener(EVENT, listener);
};
