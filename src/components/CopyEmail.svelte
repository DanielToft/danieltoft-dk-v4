<script lang="ts">
  let { email }: { email: string } = $props();

  let state = $state<'idle' | 'copied' | 'failed'>('idle');
  let timer: ReturnType<typeof setTimeout> | undefined;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      state = 'copied';
    } catch {
      state = 'failed';
    }
    clearTimeout(timer);
    timer = setTimeout(() => (state = 'idle'), 2200);
  };

  const label = $derived(state === 'copied' ? 'Kopieret' : state === 'failed' ? 'Kunne ikke kopiere' : 'Kopiér');
</script>

<button type="button" class="copy" class:done={state === 'copied'} onclick={copy} aria-label="Kopiér emailadressen">
  <svg viewBox="0 0 16 16" aria-hidden="true">
    {#if state === 'copied'}
      <path d="M3 8.5l3 3 7-7" />
    {:else}
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
      <path d="M10.5 3.5v-.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h.5" />
    {/if}
  </svg>
  <span>{label}</span>
</button>
<span class="sr-only" role="status" aria-live="polite">{state === 'copied' ? 'Emailadressen er kopieret' : ''}</span>

<style>
  .copy {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    height: 2.25rem;
    padding: 0 var(--space-4);
    border: 1px solid var(--sage);
    border-radius: var(--radius);
    background: var(--paper);
    color: var(--ink);
    font: 600 var(--step--1) / 1 var(--font-sans);
    cursor: pointer;
    transition:
      background-color 160ms var(--ease-out),
      border-color 160ms var(--ease-out),
      color 160ms var(--ease-out);
  }

  .copy:hover {
    border-color: var(--ink);
  }

  .copy:active {
    transform: translateY(1px);
  }

  .copy.done {
    border-color: var(--ink);
    background: var(--ink);
    color: var(--mint);
  }

  svg {
    width: 1rem;
    height: 1rem;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
