<script lang="ts">
  import { formatYM, techName, toMonths } from '../data/experience';
  import { buildLog, duration, type LogRow } from '../data/log';

  const rows = buildLog();
  const lanes = Math.max(...rows.map((r) => r.lane)) + 1;
  const built = new Date();
  const builtYM = `${built.getFullYear()}-${String(built.getMonth() + 1).padStart(2, '0')}` as const;
  const host = (url: string) => new URL(url).hostname.replace(/^www\./, '');
  /** A `Kunder:` trailer names this many, then folds the rest behind a button (page script). */
  const FOLD_AFTER = 3;
</script>

<!-- The hash prints as text; with JS the checkout island swaps in the button, which rewinds the page to the row. -->
{#snippet hash(row: LogRow)}
  <span class="hash" aria-hidden="true" data-hash-text>{row.hash}</span>
  {#if row.kind !== 'root'}
    <button
      type="button"
      class="hash"
      data-checkout={row.hash}
      title="git checkout {row.hash}"
      aria-label="git checkout {row.hash}: se siden som i {formatYM(row.date)}"
      hidden>{row.hash}</button
    >
  {/if}
{/snippet}

<p class="cmd" aria-hidden="true">
  <span class="prompt">$</span> git log --graph --author="Daniel Toft"<span data-grep-arg></span><span
    class="hint"
    data-checkout-hint
    hidden>{'  '}# klik en hash for at rejse tilbage i tid</span
  >
</p>

<ol class="log" style:--lanes={lanes} data-log>
  {#each rows as row (row.hash)}
    <li
      class="row"
      class:head={row.head}
      class:merge={row.kind === 'merge'}
      class:on-branch={row.lane > 0}
      data-tech={row.role?.tech?.map(techName).join('|')}
      data-hash={row.hash}
      data-at={toMonths(row.date)}
    >
      <span class="g" aria-hidden="true">
        {#if row.top}<span class="lane top l{row.lane}"></span>{/if}
        {#if row.bottom}<span class="lane bottom l{row.lane}"></span>{/if}
        {#each row.through as lane (lane)}<span class="lane through l{lane}"></span>{/each}
        {#if row.mergeOut !== undefined}
          <svg class="curve out l{row.mergeOut}" viewBox="0 0 24 24" preserveAspectRatio="none">
            <path d="M0 0 C0 14 24 10 24 24" vector-effect="non-scaling-stroke" />
          </svg>
          <span class="lane after-out l{row.mergeOut}"></span>
        {/if}
        {#each row.forkIn as lane (lane)}
          <svg class="curve in l{lane}" viewBox="0 0 24 24" preserveAspectRatio="none">
            <path d="M24 0 C24 14 0 10 0 24" vector-effect="non-scaling-stroke" />
          </svg>
        {/each}
        <span class="node l{row.lane}"></span>
      </span>

      {#if row.role}
        {@const role = row.role}
        <div class="meta">
          {@render hash(row)}
          <p class="when">
            <span class="range">
              <time datetime={role.start}>{formatYM(role.start)}</time>
              <span aria-hidden="true">–</span><span class="sr-only">til</span>
              <span data-end>{#if role.end}<time datetime={role.end}>{formatYM(role.end)}</time>{:else}nu{/if}</span>
            </span>
            {#if role.end}
              {@const dur = duration(role.start, role.end)}
              {#if dur}<span class="dur" data-dur>{dur}</span>{/if}
            {:else}
              <span class="dur" data-dur data-since={role.start}>{duration(role.start, builtYM)}</span>
            {/if}
          </p>
        </div>
        <div class="msg">
          <h3 class="company">
            {#if role.url}<a href={role.url} title={host(role.url)}>{role.company}</a>{:else}{role.company}{/if}
            {#if row.head}<span class="ref head-ref" data-main-ref
                ><span class="sr-only">nuværende rolle, </span><span data-ref-name>HEAD -&gt; main</span></span
              >{/if}
            {#if role.branch}<span class="ref branch l{row.lane}"><span class="sr-only">parallelt forløb, </span>{role.branch}</span>{/if}
          </h3>
          <p class="title">{role.title}</p>
          {#if role.summary}<p class="summary">{role.summary}</p>{/if}
          {#if role.tech}<p class="trailer">Tech: {role.tech.map(techName).join(', ')}</p>{/if}
          {#if role.clients}
            {@const shown = role.clients.slice(0, FOLD_AFTER)}
            {@const rest = role.clients.slice(FOLD_AFTER)}
            <p class="trailer" data-fold>
              Kunder: {shown.join(', ')}{#if rest.length}<span data-rest>, {rest.join(', ')}</span><span
                  data-more
                  hidden
                  >, <button type="button" class="more">+{rest.length} flere<span class="sr-only"> kunder</span></button
                  ></span
                >{/if}
            </p>
          {/if}
        </div>
      {:else}
        <div class="meta">
          {@render hash(row)}
          <p class="when"><time datetime={row.date}>{formatYM(row.date)}</time></p>
        </div>
        <div class="msg">
          {#if row.kind === 'root'}
            <p class="merge-msg">Initial commit<span class="sr-only"> (født)</span></p>
          {:else}
            <p class="merge-msg">Merge branch '{row.merged}'</p>
          {/if}
        </div>
      {/if}
    </li>
  {/each}
</ol>

<p class="end" aria-hidden="true">(END)</p>

<style>
  .cmd,
  .end,
  .hash,
  .when,
  .ref,
  .merge-msg,
  .trailer {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
  }

  .cmd {
    margin-block: var(--space-5) var(--space-4);
    color: var(--ink-muted);
    font-size: var(--step--1);
    overflow-wrap: anywhere;
  }

  .prompt {
    color: var(--ink);
    font-weight: 700;
  }

  .hint {
    white-space: pre-wrap;
  }

  .log {
    --x0: 0.75rem;
    --lane-gap: 1.125rem;
    --x1: calc(var(--x0) + var(--lane-gap));
    --x2: calc(var(--x0) + 2 * var(--lane-gap));
    --g-w: calc(2 * var(--x0) + (var(--lanes, 2) - 1) * var(--lane-gap));
    --stroke: 3px;
    --node: 0.875rem;
    --node-y: 2rem;
    --pad: 1.25rem;
    --curve-h: 1.5rem;
    --lane-ink: var(--ink);
  }

  /* Per lane: x position, stroke colour and ref pill fill. */
  .l0 {
    --x: var(--x0);
    --c: var(--lane-ink);
  }

  .l1 {
    --x: var(--x1);
    --c: var(--lavender-ink);
    --c-soft: var(--lavender);
  }

  .l2 {
    --x: var(--x2);
    --c: var(--sand-ink);
    --c-soft: var(--sand);
  }

  .row {
    position: relative;
    display: grid;
    grid-template-columns: var(--g-w) minmax(0, 1fr);
    grid-template-areas:
      'g meta'
      'g msg';
    column-gap: var(--space-3);
    align-items: start;
    view-timeline: --row block;
  }

  /* Hairline between entries, never under the graph. */
  .row + .row::before {
    content: '';
    position: absolute;
    top: 0;
    left: calc(var(--g-w) + var(--space-3));
    right: 0;
    height: 1px;
    background: var(--sage-soft);
  }

  .row.head + .row::before {
    display: none;
  }

  .g {
    grid-area: g;
    align-self: stretch;
    position: relative;
    min-height: 100%;
  }

  .meta {
    grid-area: meta;
    display: flex;
    flex-wrap: wrap;
    gap: 0 var(--space-3);
    padding-top: var(--pad);
  }

  .hash {
    grid-area: hash;
    color: var(--ink-muted);
    font-size: var(--step--1);
    line-height: 1.5rem;
  }

  /* Checkout-able: reads like the diffstat's names, a Sage underline at rest. */
  button.hash {
    justify-self: start;
    align-self: start;
    padding: 0;
    border: 0;
    background: none;
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    text-decoration: underline 2px var(--sage);
    text-underline-offset: 0.22em;
    transition: text-decoration-color 160ms var(--ease-out);
  }

  button.hash:hover {
    text-decoration-color: currentColor;
  }

  .when {
    grid-area: when;
    display: contents;
    color: var(--ink);
    font-size: var(--step--1);
    line-height: 1.5rem;
  }

  .dur {
    flex-basis: 100%;
    padding-left: calc(7ch + var(--space-3));
    color: var(--ink-muted);
  }

  .msg {
    grid-area: msg;
    padding-block: var(--space-1) var(--pad);
    min-width: 0;
  }

  .company {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2) var(--space-3);
    font-size: var(--step-1);
    font-weight: 600;
    line-height: 2rem;
    letter-spacing: -0.02em;
  }

  .company a {
    text-decoration-thickness: 2px;
  }

  .title {
    color: var(--ink);
    font-weight: 500;
  }

  .summary {
    max-width: 58ch;
    margin-top: var(--space-2);
    color: var(--ink-body);
  }

  .trailer {
    max-width: 58ch;
    margin-top: var(--space-2);
    color: var(--ink-muted);
    font-size: var(--step--1);
    line-height: 1.5rem;
  }

  /* Trailers are consecutive lines, like in a commit message. */
  .trailer + .trailer {
    margin-top: 0;
  }

  .more {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
    text-decoration: underline 2px var(--sage);
    text-underline-offset: 0.22em;
    transition: text-decoration-color 160ms var(--ease-out);
  }

  .more:hover {
    text-decoration-color: currentColor;
  }

  .merge-msg {
    color: var(--ink-muted);
    font-size: var(--step--1);
    line-height: 1.5rem;
  }

  .merge .msg {
    padding-bottom: var(--pad);
  }

  /* The `HEAD` ref the checkout island hangs on a merge row. */
  .merge-msg :global(.ref) {
    margin-left: var(--space-2);
  }

  .ref {
    display: inline-flex;
    align-items: center;
    height: 1.5rem;
    padding: 0 0.55em;
    border-radius: var(--radius);
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 1;
    font-variant-ligatures: contextual;
  }

  .head-ref {
    background: var(--mint);
    color: var(--ink);
  }

  /* Detached: `main` stays on its row, off the band. */
  .row:not(.head) .head-ref {
    background: var(--ink);
    color: var(--mint);
  }

  .branch {
    background: var(--c-soft);
    color: var(--c);
  }

  /* HEAD: the one inverted band. */
  .head {
    --lane-ink: var(--mint);
    margin-inline: calc(var(--space-2) * -1);
    padding-inline: var(--space-2);
    border-radius: 2px;
    background: var(--ink);
    color: var(--mint);
  }

  .head .company,
  .head .title,
  .head .when,
  .head .summary {
    color: var(--mint);
  }

  .head .hash,
  .head .dur,
  .head .trailer,
  .head .merge-msg {
    color: var(--sage-soft);
  }

  .head button.hash {
    text-decoration-color: var(--sage);
  }

  .head button.hash:hover {
    text-decoration-color: var(--mint);
  }

  /* A checked-out branch row carries the band too: its lanes take the light tint. */
  .head .g .l1 {
    --c: var(--lavender);
  }

  .head .g .l2 {
    --c: var(--sand);
  }

  .head .company a {
    text-decoration-color: var(--sage);
  }

  .head .company a:hover {
    text-decoration-color: var(--mint);
  }

  .head :global(a:focus-visible),
  .head .more:focus-visible,
  .head button.hash:focus-visible,
  .head [data-rest]:focus-visible {
    outline-color: var(--mint);
  }

  .head .msg {
    padding-bottom: calc(var(--pad) + var(--space-2));
  }

  /* `git log --grep` from the skills diffstat: rows it skips fade, the lanes stay whole. */
  /* Leaves, not .meta/.when: those turn `display: contents` at some widths, where opacity does nothing. */
  .hash,
  .when > *,
  .msg {
    transition: opacity 160ms var(--ease-out);
  }

  .row:global([data-miss]) :is(.hash, .when > *, .msg) {
    opacity: 0.4;
  }

  .row:global([data-miss]) .node {
    --c: var(--sage);
  }

  /* `git checkout`: commits after the checked-out month aren't written yet. The whole row fades, graph too. */
  .row {
    transition: opacity 200ms var(--ease-out);
  }

  .row:global([data-future]) {
    opacity: 0.22;
  }

  /* ---- graph ---- */
  .lane {
    position: absolute;
    left: var(--x);
    width: var(--stroke);
    margin-left: calc(var(--stroke) / -2);
    background: var(--c);
    transform-origin: top;
  }

  .lane.top {
    top: 0;
    height: var(--node-y);
  }

  .lane.bottom {
    top: var(--node-y);
    bottom: 0;
  }

  .lane.through {
    top: 0;
    bottom: 0;
  }

  .lane.after-out {
    top: calc(var(--node-y) + var(--curve-h));
    bottom: 0;
  }

  .node {
    position: absolute;
    top: calc(var(--node-y) - var(--node) / 2);
    left: calc(var(--x) - var(--node) / 2);
    width: var(--node);
    height: var(--node);
    border: var(--stroke) solid var(--c);
    border-radius: 50%;
    background: var(--mint);
  }

  .merge .node {
    --node: 0.625rem;
    background: var(--c);
  }

  .curve {
    position: absolute;
    left: var(--x0);
    width: calc(var(--x) - var(--x0));
    overflow: visible;
    fill: none;
    stroke: var(--c);
    stroke-width: var(--stroke);
    stroke-linecap: round;
  }

  .curve.out {
    top: var(--node-y);
    height: var(--curve-h);
  }

  .curve.in {
    top: 0;
    height: var(--node-y);
  }

  .end {
    margin-top: var(--space-4);
    padding-left: calc(var(--g-w) + var(--space-3));
    color: var(--ink-muted);
    font-size: var(--step--1);
  }

  @media (min-width: 48rem) {
    .log {
      --x0: 1rem;
      --lane-gap: 1.5rem;
      --node-y: 2.5rem;
      --pad: 1.5rem;
    }

    .row {
      grid-template-columns: var(--g-w) 5.5rem minmax(0, 1fr) 13rem;
      grid-template-areas: 'g hash msg when';
      column-gap: var(--space-4);
    }

    .row + .row::before {
      left: calc(var(--g-w) + var(--space-4));
    }

    .meta {
      display: contents;
    }

    .hash,
    .when {
      padding-top: var(--pad);
    }

    .hash,
    .when,
    .merge-msg {
      line-height: 2rem;
    }

    .when {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      text-align: right;
    }

    .dur {
      flex-basis: auto;
      padding-left: 0;
    }

    .msg {
      padding-top: var(--pad);
    }

    .end {
      padding-left: calc(var(--g-w) + var(--space-4));
    }

    .head {
      margin-inline: calc(var(--space-4) * -1);
      padding-inline: var(--space-4);
    }
  }

  /* Scroll-bound drawing: state is a pure function of scroll position. */
  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      /*
        One drawing head for the whole graph, --draw-at above the viewport bottom. Each piece is
        drawn while the head crosses it, measured in px from the row's top edge (entry-crossing).
        Percentages of `cover` scale with viewport + row height, so on tall screens a row's lanes
        lagged behind the next row's and left gaps.
      */
      .log {
        --draw-at: 10vh;
      }

      .lane {
        animation: draw-y linear both;
      }

      .node {
        animation: pop linear both;
        animation-range:
          entry-crossing calc(var(--draw-at) + var(--node-y) - var(--node) / 2)
          entry-crossing calc(var(--draw-at) + var(--node-y) + var(--node) * 1.5);
      }

      /* Curves are revealed top-down: a dash trick breaks on non-uniformly scaled, non-scaling strokes. */
      .curve {
        animation: reveal-y linear both;
      }

      /*
        The timeline lives in its own, more specific rule: CSS minifiers fold a same-rule
        animation-timeline into the animation shorthand, which browsers then reject.
      */
      .g .lane,
      .g .node,
      .g .curve {
        animation-timeline: --row;
      }

      .lane.top,
      .curve.in {
        animation-range: entry-crossing var(--draw-at) entry-crossing calc(var(--draw-at) + var(--node-y));
      }

      .lane.bottom {
        animation-range: entry-crossing calc(var(--draw-at) + var(--node-y)) entry-crossing calc(var(--draw-at) + 100%);
      }

      .lane.through {
        animation-range: entry-crossing var(--draw-at) entry-crossing calc(var(--draw-at) + 100%);
      }

      .curve.out {
        animation-range:
          entry-crossing calc(var(--draw-at) + var(--node-y))
          entry-crossing calc(var(--draw-at) + var(--node-y) + var(--curve-h));
      }

      .lane.after-out {
        animation-range:
          entry-crossing calc(var(--draw-at) + var(--node-y) + var(--curve-h))
          entry-crossing calc(var(--draw-at) + 100%);
      }
    }
  }

  @keyframes draw-y {
    from {
      transform: scaleY(0);
    }
    to {
      transform: scaleY(1);
    }
  }

  /* Insets reach past the box so the stroke's round caps are never clipped. */
  @keyframes reveal-y {
    from {
      clip-path: inset(calc(var(--stroke) * -1) calc(var(--stroke) * -1) calc(100% + var(--stroke)));
    }
    to {
      clip-path: inset(calc(var(--stroke) * -1));
    }
  }

  @keyframes pop {
    from {
      transform: scale(0);
    }
    70% {
      transform: scale(1.25);
    }
    to {
      transform: scale(1);
    }
  }
</style>
