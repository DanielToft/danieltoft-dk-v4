<script lang="ts">
  import { formatYM } from '../data/experience';
  import { buildLog, duration } from '../data/log';

  const rows = buildLog();
  const built = new Date();
  const builtYM = `${built.getFullYear()}-${String(built.getMonth() + 1).padStart(2, '0')}` as const;
  const host = (url: string) => new URL(url).hostname.replace(/^www\./, '');
</script>

<p class="cmd" aria-hidden="true"><span class="prompt">$</span> git log --graph --author="Daniel Toft"</p>

<ol class="log">
  {#each rows as row (row.hash)}
    <li
      class="row"
      class:head={row.head}
      class:merge={row.kind === 'merge'}
      class:on-branch={row.lane === 1}
    >
      <span class="g" aria-hidden="true">
        {#if row.top}<span class="lane top l{row.lane}"></span>{/if}
        {#if row.bottom}<span class="lane bottom l{row.lane}"></span>{/if}
        {#each row.through as lane (lane)}<span class="lane through l{lane}"></span>{/each}
        {#if row.mergeOut}
          <svg class="curve out" viewBox="0 0 24 24" preserveAspectRatio="none">
            <path d="M0 0 C0 14 24 10 24 24" pathLength="1" vector-effect="non-scaling-stroke" />
          </svg>
          <span class="lane after-out l1"></span>
        {/if}
        {#if row.forkIn}
          <svg class="curve in" viewBox="0 0 24 24" preserveAspectRatio="none">
            <path d="M24 0 C24 14 0 10 0 24" pathLength="1" vector-effect="non-scaling-stroke" />
          </svg>
        {/if}
        <span class="node l{row.lane}"></span>
      </span>

      {#if row.role}
        {@const role = row.role}
        <div class="meta">
          <span class="hash" aria-hidden="true">{row.hash}</span>
          <p class="when">
            <span class="range">
              <time datetime={role.start}>{formatYM(role.start)}</time>
              <span aria-hidden="true">–</span><span class="sr-only">til</span>
              {#if role.end}<time datetime={role.end}>{formatYM(role.end)}</time>{:else}nu{/if}
            </span>
            {#if role.end}
              <span class="dur">{duration(role.start, role.end)}</span>
            {:else}
              <span class="dur" data-since={role.start}>{duration(role.start, builtYM)}</span>
            {/if}
          </p>
        </div>
        <div class="msg">
          <h3 class="company">
            {#if role.url}<a href={role.url} title={host(role.url)}>{role.company}</a>{:else}{role.company}{/if}
            {#if row.head}<span class="ref head-ref"><span class="sr-only">nuværende rolle, </span>HEAD -&gt; main</span>{/if}
            {#if role.branch}<span class="ref branch"><span class="sr-only">parallelt forløb, </span>{role.branch}</span>{/if}
          </h3>
          <p class="title">{role.title}</p>
          {#if role.summary}<p class="summary">{role.summary}</p>{/if}
        </div>
      {:else}
        <div class="meta">
          <span class="hash" aria-hidden="true">{row.hash}</span>
          <p class="when"><time datetime={row.date}>{formatYM(row.date)}</time></p>
        </div>
        <div class="msg">
          <p class="merge-msg">Merge branch '{row.merged}'</p>
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
  .merge-msg {
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

  .log {
    --g-w: 2.75rem;
    --x0: 0.75rem;
    --x1: 2rem;
    --stroke: 3px;
    --node: 0.875rem;
    --node-y: 2rem;
    --pad: 1.25rem;
    --curve-h: 1.5rem;
    --lane-ink: var(--ink);
    --branch-ink: var(--lavender-ink);
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

  .merge-msg {
    color: var(--ink-muted);
    font-size: var(--step--1);
    line-height: 1.5rem;
  }

  .merge .msg {
    padding-bottom: var(--pad);
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

  .branch {
    background: var(--lavender);
    color: var(--lavender-ink);
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
  .head .dur {
    color: var(--sage-soft);
  }

  .head .company a {
    text-decoration-color: var(--sage);
  }

  .head .company a:hover {
    text-decoration-color: var(--mint);
  }

  .head :global(a:focus-visible) {
    outline-color: var(--mint);
  }

  .head .msg {
    padding-bottom: calc(var(--pad) + var(--space-2));
  }

  /* ---- graph ---- */
  .lane {
    position: absolute;
    width: var(--stroke);
    margin-left: calc(var(--stroke) / -2);
    background: var(--lane-ink);
    transform-origin: top;
  }

  .lane.l0 {
    left: var(--x0);
  }

  .lane.l1 {
    left: var(--x1);
    background: var(--branch-ink);
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
    left: calc(var(--x0) - var(--node) / 2);
    width: var(--node);
    height: var(--node);
    border: var(--stroke) solid var(--lane-ink);
    border-radius: 50%;
    background: var(--mint);
  }

  .node.l1 {
    left: calc(var(--x1) - var(--node) / 2);
    border-color: var(--branch-ink);
  }

  .merge .node {
    --node: 0.625rem;
    background: var(--lane-ink);
  }

  .curve {
    position: absolute;
    left: var(--x0);
    width: calc(var(--x1) - var(--x0));
    overflow: visible;
    fill: none;
    stroke: var(--branch-ink);
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

  .curve path {
    stroke-dasharray: 1;
    stroke-dashoffset: 0;
  }

  .end {
    margin-top: var(--space-4);
    padding-left: calc(var(--g-w) + var(--space-3));
    color: var(--ink-muted);
    font-size: var(--step--1);
  }

  @media (min-width: 48rem) {
    .log {
      --g-w: 3.5rem;
      --x0: 1rem;
      --x1: 2.5rem;
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
      .lane {
        animation: draw-y linear both;
      }

      .node {
        animation: pop linear both;
        animation-range: cover 6% cover 12%;
      }

      .curve path {
        animation: draw-path linear both;
      }

      /*
        The timeline lives in its own, more specific rule: CSS minifiers fold a same-rule
        animation-timeline into the animation shorthand, which browsers then reject.
      */
      .g .lane,
      .g .node,
      .g .curve path {
        animation-timeline: --row;
      }

      .lane.top {
        animation-range: cover 0% cover 14%;
      }

      .lane.bottom,
      .lane.after-out {
        animation-range: cover 10% cover 26%;
      }

      .lane.through {
        animation-range: cover 0% cover 26%;
      }

      .curve.in path {
        animation-range: cover 0% cover 12%;
      }

      .curve.out path {
        animation-range: cover 10% cover 18%;
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

  @keyframes draw-path {
    from {
      stroke-dashoffset: 1;
    }
    to {
      stroke-dashoffset: 0;
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
