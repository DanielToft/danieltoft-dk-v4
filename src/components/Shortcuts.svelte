<script lang="ts">
  import { onMount } from 'svelte';

  let { email, github, linkedin }: { email: string; github: string; linkedin: string } = $props();

  onMount(() => {
    const keys: Record<string, () => void> = {
      e: () => (location.href = `mailto:${email}`),
      g: () => window.open(github, '_blank', 'noopener'),
      l: () => window.open(linkedin, '_blank', 'noopener'),
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable]')) return;
      const run = keys[event.key.toLowerCase()];
      if (run) {
        event.preventDefault();
        run();
      }
    };

    addEventListener('keydown', onKey);

    console.log(
      '%c$ git log --author="Daniel Toft"%c\nHej udvikler. Kig gerne i kilden: https://github.com/DanielToft\nGenveje: e = email, g = GitHub, l = LinkedIn\nTidsrejse: j/k går gennem loggen, Esc = git switch main',
      'color:#214b3c;background:#d5f4e5;font:600 13px "Cascadia Code",monospace;padding:4px 8px;border-radius:4px',
      'color:inherit;font:12px monospace',
    );

    return () => removeEventListener('keydown', onKey);
  });
</script>
