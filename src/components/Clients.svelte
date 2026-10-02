<script lang="ts">
  import { buildCredits } from '../data/clients';
  import { toMonths } from '../data/experience';

  const credits = buildCredits();
  const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
</script>

<p class="cmd" aria-hidden="true">
  <span class="prompt">$</span> git log --format='%(trailers:key=Kunder,valueonly)' | awk '!seen[$0]++'
</p>

<ul class="credits" data-credits>
  {#each credits as { name, url, since }, i (name)}
    <li data-at={toMonths(since)}>
      {#if url}<a href={url} title={bare(url)}>{name}</a>{:else}{name}{/if}{#if i < credits.length - 1}<span
          class="sep"
          aria-hidden="true">{' /'}</span
        >{/if}
    </li>
  {/each}
</ul>

<style>
  .cmd {
    margin-block: var(--space-5) var(--space-4);
    color: var(--ink-muted);
    font-family: var(--font-mono);
    font-size: var(--step--1);
    font-variant-ligatures: none;
    /* Break between the pipeline's words, inside one only when it can't fit. */
    overflow-wrap: break-word;
  }

  .prompt {
    color: var(--ink);
    font-weight: 700;
  }

  /* The names a person would say, so Space Grotesk: the command prints them, the page sets them. */
  .credits {
    display: flex;
    flex-wrap: wrap;
    column-gap: 0.4em;
    max-width: 64rem;
    color: var(--ink);
    font-size: var(--step-1);
    font-weight: 600;
    line-height: 1.45;
    letter-spacing: -0.02em;
  }

  /* Lines break after a slash: a flex item moves down whole, and only a name wider than the column wraps. */
  li {
    min-width: 0;
    transition: opacity 200ms var(--ease-out);
  }

  /* `git checkout`: clients from after the checked-out month fade, like the log's future rows. */
  li:global([data-future]) {
    opacity: 0.22;
  }

  .sep {
    color: var(--ink-muted);
    font-weight: 400;
  }

  /* Print: the names without the command over them. */
  @media print {
    .cmd {
      display: none;
    }

    .credits {
      max-width: none;
      margin-top: var(--space-4);
      font-size: var(--step-0);
    }
  }
</style>
