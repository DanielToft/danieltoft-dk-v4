<script lang="ts">
  import { onMount } from 'svelte';

  /** `since` is an ISO date; `builtAt` is the build timestamp so SSR and hydration agree. */
  let { since, builtAt }: { since: string; builtAt: number } = $props();

  let now = $state(builtAt);

  const pad = (n: number) => String(n).padStart(2, '0');

  const split = (from: Date, to: Date) => {
    let y = to.getFullYear() - from.getFullYear();
    let m = to.getMonth() - from.getMonth();
    let d = to.getDate() - from.getDate();
    if (d < 0) {
      m -= 1;
      d += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    }
    if (m < 0) {
      y -= 1;
      m += 12;
    }
    return { y, m, d };
  };

  const start = new Date(`${since}T00:00:00`);
  const parts = $derived.by(() => {
    const to = new Date(now);
    return { ...split(start, to), hh: pad(to.getHours()), mm: pad(to.getMinutes()), ss: pad(to.getSeconds()) };
  });

  onMount(() => {
    now = Date.now();
    const id = setInterval(() => (now = Date.now()), 1000);
    return () => clearInterval(id);
  });
</script>

<span class="uptime" title="Tid siden mit første job i maj 2008">
  <span class="sr-only">{parts.y} år, {parts.m} måneder og {parts.d} dage</span>
  <span aria-hidden="true">{parts.y} år {parts.m} mdr {parts.d} d <span class="clock">{parts.hh}:{parts.mm}:{parts.ss}</span></span>
</span>

<style>
  .uptime {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .clock {
    color: var(--ink-muted);
  }
</style>
