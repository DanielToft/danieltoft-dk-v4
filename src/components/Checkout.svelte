<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { formatYM, fromMonths } from '../data/experience';
  import { duration } from '../data/log';
  import { checkout, onCheckout, type Checkout, type Commit } from '../scripts/checkout';

  /** Newest first, as the log prints them, without the root. `builtAt` keeps SSR and hydration in step. */
  let { commits, builtAt }: { commits: Commit[]; builtAt: number } = $props();

  const built = new Date(builtAt);
  let now = $state(built.getFullYear() * 12 + built.getMonth());
  let current = $state<Checkout | null>(null);
  let status = $state('');
  let height = $state(0);

  const first = Math.min(...commits.map((c) => c.at));
  const byHash = (hash: string) => commits.find((c) => c.hash === hash)!;
  const head = $derived(current && byHash(current.hash));
  /** Where a month sits on the slider, 0–1. */
  const pos = (at: number) => (at - first) / (now - first);

  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rowOf = (hash: string) => document.querySelector<HTMLElement>(`[data-log] > li[data-hash="${hash}"]`);

  /** `git checkout <hash>`: the page as of the commit's month. */
  const toCommit = async (c: Commit, scroll: boolean) => {
    checkout({ hash: c.hash, at: c.at, ref: c.hash });
    status = `HEAD er nu på ${c.hash} ${c.subject}. Siden viser ${formatYM(fromMonths(c.at))}.`;
    if (!scroll) return;
    // After the bar has its height, so `scroll-padding-bottom` keeps the row clear of it.
    await tick();
    rowOf(c.hash)?.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
  };

  /** The slider, like `main@{date}`: HEAD on the newest commit on main from that month or before. */
  const toMonth = (at: number) => {
    const done = commits.filter((c) => c.at <= at);
    const c = done.find((d) => d.lane === 0) ?? done[0] ?? commits[commits.length - 1];
    checkout({ hash: c.hash, at, ref: `main@{${fromMonths(at)}}` });
  };

  let returnTo: HTMLElement | null = null;

  const toMain = () => {
    // The bar is about to go: don't drop focus with it.
    const inBar = document.activeElement?.closest('[data-checkout-bar]');
    checkout(null);
    status = 'HEAD er tilbage på main.';
    if (inBar) (returnTo?.isConnected ? returnTo : document.getElementById('erfaring-h'))?.focus();
  };

  // ---- the static page: log, credits and the hero's role. The islands listen for themselves. ----

  const saved = new Map<Element, string>();
  /** Sets an element's text, or with `null` puts back what the build printed. */
  const swap = (el: Element | null, text: string | null) => {
    if (!el) return;
    if (!saved.has(el)) saved.set(el, el.innerHTML);
    if (text === null) el.innerHTML = saved.get(el)!;
    else el.textContent = text;
  };

  const roleAt = (next: Checkout) => {
    const own = byHash(next.hash).role;
    if (own) return own.label;
    const running = commits.filter((c) => c.role && c.role.start <= next.at && (c.role.end ?? Infinity) > next.at);
    return (running.find((c) => c.lane === 0) ?? running[0])?.role?.label ?? '–';
  };

  const apply = (next: Checkout | null) => {
    const at = next?.at ?? Infinity;
    const mainRef = document.querySelector<HTMLElement>('[data-main-ref]');
    const tip = mainRef?.closest('li');

    for (const row of document.querySelectorAll<HTMLElement>('[data-log] > li')) {
      row.toggleAttribute('data-future', Number(row.dataset.at) > at);
      row.classList.toggle('head', next ? row.dataset.hash === next.hash : row === tip);
      // A role still running at the month reads `– nu`, its length counted up to then.
      const role = commits.find((c) => c.hash === row.dataset.hash)?.role;
      const running = !!role && role.start <= at && (role.end ?? Infinity) > at;
      swap(row.querySelector('[data-end]'), running ? 'nu' : null);
      swap(row.querySelector('[data-dur]'), running ? duration(fromMonths(role.start), fromMonths(at)) : null);
    }

    // Refs as `git log --decorate` puts them: `HEAD -> main` on main, `HEAD` and `main` apart when detached.
    if (mainRef) {
      const onTip = !next || next.hash === tip?.dataset.hash;
      swap(mainRef.querySelector('[data-ref-name]'), !next ? null : onTip ? 'HEAD, main' : 'main');
      headRef ??= makeHeadRef(mainRef);
      if (onTip) headRef.remove();
      else if (next) {
        const target = rowOf(next.hash)?.querySelector('.company, .merge-msg');
        target?.insertBefore(headRef, target.querySelector('.ref'));
      }
    }

    for (const li of document.querySelectorAll<HTMLElement>('[data-credits] > li')) {
      li.toggleAttribute('data-future', Number(li.dataset.at) > at);
    }

    swap(document.querySelector('[data-fact-role]'), next ? roleAt(next) : null);
  };

  let headRef: HTMLElement | undefined;
  const makeHeadRef = (mainRef: HTMLElement) => {
    const ref = mainRef.cloneNode(true) as HTMLElement;
    ref.removeAttribute('data-main-ref');
    ref.querySelector('.sr-only')!.textContent = 'checket ud, ';
    ref.querySelector('[data-ref-name]')!.textContent = 'HEAD';
    return ref;
  };

  // ---- keys: j/k step through the log like tig, Esc goes back to main ----

  const onKey = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('input:not([type="range"]), textarea, select, [contenteditable]')) return;

    if (event.key === 'Escape') {
      if (!current) return;
      event.preventDefault();
      toMain();
      return;
    }

    const step = ({ j: 1, k: -1 } as Record<string, number>)[event.key.toLowerCase()];
    if (!step) return;
    event.preventDefault();
    const i = current ? commits.findIndex((c) => c.hash === current!.hash) : 0;
    const next = commits[i + step];
    if (next) toCommit(next, true);
    else if (step < 0 && current) toMain();
  };

  onMount(() => {
    now = new Date().getFullYear() * 12 + new Date().getMonth();

    // Hashes turn into checkout buttons only now: without JS they print as text.
    const log = document.querySelector<HTMLElement>('[data-log]');
    for (const text of log?.querySelectorAll<HTMLElement>('[data-hash-text]') ?? []) {
      const button = text.parentElement?.querySelector<HTMLButtonElement>('[data-checkout]');
      if (!button) continue;
      text.hidden = true;
      button.hidden = false;
    }
    for (const hint of document.querySelectorAll<HTMLElement>('[data-checkout-hint]')) hint.hidden = false;

    const onClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-checkout]');
      if (!button) return;
      returnTo = button;
      // A second click on the checked-out hash goes back to main, like the diffstat's grep.
      if (current?.ref === button.dataset.checkout) toMain();
      else toCommit(byHash(button.dataset.checkout!), false);
    };
    log?.addEventListener('click', onClick);

    const off = onCheckout((next) => {
      current = next;
      apply(next);
    });

    return () => {
      log?.removeEventListener('click', onClick);
      off();
    };
  });

  $effect(() => {
    document.documentElement.style.setProperty('--checkout-h', `${current ? height : 0}px`);
  });
</script>

<svelte:window onkeydown={onKey} />

{#if current && head}
  {@const month = formatYM(fromMonths(current.at))}
  <section class="bar" aria-label="Tidsrejse" data-checkout-bar bind:clientHeight={height}>
    <div class="wrap inner">
      <p class="cmd"><span class="prompt">$</span> git checkout {current.ref}</p>
      <p class="msg">
        HEAD er nu på <span class="hash">{head.hash}</span> {head.subject}. Du er i 'detached HEAD'-tilstand.
      </p>
      <p class="month" aria-hidden="true">{month}</p>

      <div class="scrub">
        <span class="end" aria-hidden="true">{fromMonths(first).slice(0, 4)}</span>
        <div class="track" style:--fill="{pos(current.at) * 100}%">
          <span class="ticks" aria-hidden="true">
            {#each commits as c (c.hash)}
              <span
                class="tick l{c.lane}"
                class:future={c.at > current.at}
                class:head={c.hash === head.hash && c.at !== current.at}
                style:--p={pos(c.at)}
              ></span>
            {/each}
          </span>
          <input
            type="range"
            min={first}
            max={now}
            step="1"
            value={current.at}
            aria-label="Måned"
            aria-valuetext={month}
            oninput={(event) => toMonth(Number(event.currentTarget.value))}
          />
        </div>
        <span class="end" aria-hidden="true">nu</span>
      </div>

      <button type="button" class="switch" onclick={toMain}>git switch main <kbd>esc</kbd></button>
    </div>
  </section>
{/if}
<p class="sr-only" role="status" aria-live="polite">{status}</p>

<style>
  .bar {
    position: fixed;
    inset: auto 0 0;
    z-index: 5;
    background: var(--ink);
    color: var(--mint);
    animation: rise 320ms var(--ease-out);
  }

  @keyframes rise {
    from {
      transform: translateY(100%);
    }
  }

  .inner {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      'month switch'
      'cmd cmd'
      'scrub scrub';
    align-items: center;
    gap: var(--space-1) var(--space-4);
    padding-block: var(--space-3) var(--space-2);
  }

  .cmd,
  .msg,
  .end,
  .switch {
    font-family: var(--font-mono);
    font-size: var(--step--1);
    font-variant-ligatures: none;
  }

  .cmd {
    grid-area: cmd;
    color: var(--sage-soft);
    overflow-wrap: anywhere;
  }

  .prompt {
    color: var(--mint);
    font-weight: 700;
  }

  /* The full git message is for wide screens; on a phone the log's `HEAD` ref says it. */
  .msg {
    display: none;
    grid-area: msg;
    color: var(--sage-soft);
  }

  .hash {
    color: var(--mint);
  }

  .month {
    grid-area: month;
    font-size: var(--step-2);
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }

  .switch {
    grid-area: switch;
    justify-self: end;
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    height: 2.25rem;
    padding: 0 var(--space-2) 0 var(--space-4);
    border: 1px solid var(--sage);
    border-radius: var(--radius);
    background: none;
    color: var(--mint);
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    transition: border-color 160ms var(--ease-out);
  }

  .switch:hover {
    border-color: var(--mint);
  }

  .switch kbd {
    border-color: var(--sage);
    background: var(--ink);
    color: var(--mint);
  }

  .bar :focus-visible {
    outline-color: var(--mint);
  }

  /* ---- the slider: main as a lane, each commit a node on it, the thumb is HEAD ---- */
  .scrub {
    grid-area: scrub;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--space-3);
  }

  .end {
    color: var(--sage-soft);
  }

  .track {
    --thumb: 1.125rem;
    --stroke: 3px;
    position: relative;
  }

  /* Over the input, so a commit shows as a dot inside the thumb when HEAD sits right on it. */
  .ticks {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }

  /* The thumb's centre runs from half a thumb in to half a thumb short: ticks follow the same line. */
  .tick {
    position: absolute;
    top: 50%;
    left: calc(var(--thumb) / 2 + (100% - var(--thumb)) * var(--p));
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--c, var(--mint));
    translate: -50% -50%;
    transition:
      scale 160ms var(--ease-out),
      background-color 160ms var(--ease-out);
  }

  /* Not written yet at the month: hollow, like the log's nodes. */
  .tick.future {
    background: var(--ink);
    box-shadow: inset 0 0 0 2px var(--c, var(--mint));
  }

  .tick.l1 {
    --c: var(--lavender);
  }

  .tick.l2 {
    --c: var(--sand);
  }

  /* Scrubbed past it, HEAD's commit stays marked. */
  .tick.head {
    scale: 1.5;
  }

  input {
    position: relative;
    display: block;
    width: 100%;
    height: 2.75rem;
    margin: 0;
    background: none;
    cursor: pointer;
    appearance: none;
  }

  /* Up to the month is written: Mint. After it, not yet. */
  input::-webkit-slider-runnable-track {
    height: var(--stroke);
    border-radius: var(--stroke);
    background: linear-gradient(to right, var(--mint) var(--fill), var(--ink-muted) var(--fill));
  }

  input::-moz-range-track {
    height: var(--stroke);
    border-radius: var(--stroke);
    background: linear-gradient(to right, var(--mint) var(--fill), var(--ink-muted) var(--fill));
  }

  /* HEAD: a commit node, hollow like the log's. */
  input::-webkit-slider-thumb {
    width: var(--thumb);
    height: var(--thumb);
    margin-top: calc((var(--stroke) - var(--thumb)) / 2);
    border: var(--stroke) solid var(--mint);
    border-radius: 50%;
    background: var(--ink);
    appearance: none;
  }

  input::-moz-range-thumb {
    box-sizing: border-box;
    width: var(--thumb);
    height: var(--thumb);
    border: var(--stroke) solid var(--mint);
    border-radius: 50%;
    background: var(--ink);
  }

  input:focus-visible {
    outline-offset: 0;
  }

  @media (hover: none) {
    .switch {
      padding-right: var(--space-4);
    }

    .switch kbd {
      display: none;
    }
  }

  @media (min-width: 48rem) {
    .inner {
      grid-template-columns: minmax(0, 1fr) auto auto;
      grid-template-areas:
        'cmd month switch'
        'msg month switch'
        'scrub scrub scrub';
      column-gap: var(--space-6);
      padding-top: var(--space-4);
    }

    .msg {
      display: block;
    }

    .month {
      font-size: clamp(2rem, 1.4rem + 2.4vw, 3.25rem);
      letter-spacing: -0.04em;
    }
  }
</style>
