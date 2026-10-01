<script lang="ts">
  import { onMount } from 'svelte';
  import { monthsOf, type SkillStat } from '../data/skills';

  /** `root` is the log's initial commit; `builtAt` is the build timestamp so SSR and hydration agree. */
  let { stats, root, builtAt }: { stats: SkillStat[]; root: string; builtAt: number } = $props();

  type Line = { name: string; n: string; bar: string };

  let ready = $state(false);
  let grep = $state<string | null>(null);
  let status = $state('');

  onMount(() => (ready = true));

  const lines = $derived.by((): Line[] => {
    const now = new Date(ready ? Date.now() : builtAt);
    return stats.map((stat) => {
      const months = monthsOf(stat, now);
      const years = Math.floor(months / 12);
      return { name: stat.name, n: years ? `${years} år` : `${months} mdr`, bar: '+'.repeat(Math.max(1, years)) };
    });
  });
  const nameW = $derived(Math.max(...lines.map((l) => l.name.length)));
  const numW = $derived(Math.max(...lines.map((l) => l.n.length)));

  // `git log --grep` over the static log: rows without the skill fade, the graph stays whole.
  const toggle = (name: string) => {
    grep = grep === name ? null : name;
    let hits = 0;
    for (const row of document.querySelectorAll<HTMLElement>('[data-log] > li')) {
      const hit = !grep || !!row.dataset.tech?.split('|').includes(grep);
      if (grep && hit) hits++;
      row.toggleAttribute('data-miss', !hit);
    }
    const arg = document.querySelector('[data-grep-arg]');
    if (arg) arg.textContent = grep ? ` --grep="${grep}"` : '';
    status = grep ? `Erfaringen viser ${hits} ${hits === 1 ? 'post' : 'poster'} med ${grep}.` : 'Filteret er fjernet.';
  };
</script>

{#snippet cells(line: Line)}
  <span class="name">{line.name}</span>
  <span class="sep" aria-hidden="true">|</span>
  <span class="n">{line.n}</span>
  <span class="bar" aria-hidden="true">{line.bar}</span>
{/snippet}

<p class="cmd" aria-hidden="true"><span class="prompt">$</span> git diff --stat {root}..HEAD</p>

<ul
  class="stat"
  class:filtered={grep}
  style:--name-w="{nameW}ch"
  style:--num-w="{numW}ch"
  aria-label={ready ? 'Vælg en kompetence for at filtrere erfaringen' : undefined}
>
  {#each lines as line (line.name)}
    <li>
      {#if ready}
        <button
          type="button"
          class="line"
          class:on={grep === line.name}
          aria-pressed={grep === line.name}
          onclick={() => toggle(line.name)}
        >
          {@render cells(line)}
        </button>
      {:else}
        <span class="line">{@render cells(line)}</span>
      {/if}
    </li>
  {/each}
</ul>
<p class="sr-only" role="status" aria-live="polite">{status}</p>

<style>
  .cmd,
  .stat {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-variant-ligatures: none;
  }

  .cmd {
    margin-block: var(--space-5) var(--space-3);
    color: var(--ink-muted);
    font-size: var(--step--1);
    overflow-wrap: anywhere;
  }

  .prompt {
    color: var(--ink);
    font-weight: 700;
  }

  .stat {
    width: fit-content;
    max-width: 100%;
    font-size: var(--step--1);
  }

  .line {
    display: grid;
    grid-template-columns: var(--name-w) auto var(--num-w) minmax(0, 1fr);
    gap: 0 1ch;
    align-items: center;
    width: 100%;
    min-height: 2rem;
    padding: 0;
    border: 0;
    background: none;
    color: var(--ink);
    font: inherit;
    text-align: left;
    white-space: nowrap;
    transition: opacity 160ms var(--ease-out);
  }

  button.line {
    cursor: pointer;
  }

  .sep,
  .n {
    color: var(--ink-muted);
  }

  .n {
    text-align: right;
  }

  .bar {
    overflow: hidden;
  }

  /* Clickable names read like links: a Sage underline at rest, ink on hover. */
  button.line .name {
    text-decoration: underline 2px var(--sage);
    text-underline-offset: 0.22em;
    transition: text-decoration-color 160ms var(--ease-out);
  }

  button.line:hover .name,
  .on .name {
    text-decoration-color: currentColor;
  }

  .on .name {
    font-weight: 700;
  }

  .filtered .line:not(.on) {
    opacity: 0.45;
  }

  @media (pointer: coarse) {
    .line {
      min-height: 2.75rem;
    }
  }

  @media (min-width: 48rem) {
    .stat {
      font-size: var(--step-0);
    }
  }
</style>
