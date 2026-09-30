<script lang="ts">
  import { onMount } from 'svelte';

  let { text }: { text: string } = $props();

  // Close only the f–t pair so the crossbars fuse; the rest keeps the -0.04em tracking.
  const kern = text.indexOf('ft');

  let heading: HTMLHeadingElement;
  let textEl: HTMLSpanElement;
  let layer: HTMLSpanElement;
  let running = false;

  const HEX = '0123456789abcdef';
  /** Narrow fallbacks so slim letters (i, l, t, f) never get a glyph that spills into their neighbours. */
  const SLIM = 'ijlrt1!|:';
  const pick = (pool: string[]) => pool[(Math.random() * pool.length) | 0];

  /** Per slot, the hex glyphs (or slim fallbacks) whose advance fits the letter they stand in for. */
  const poolsFor = (widths: number[]) => {
    const ctx = document.createElement('canvas').getContext('2d')!;
    const style = getComputedStyle(textEl);
    ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const tracking = parseFloat(style.letterSpacing) || 0;
    const measure = (ch: string) => ctx.measureText(ch).width + tracking;
    const hex = [...HEX].map((ch) => [ch, measure(ch)] as const);
    const slim = [...SLIM].map((ch) => [ch, measure(ch)] as const);
    return widths.map((w) => {
      const fits = hex.filter(([, cw]) => cw <= w * 1.08).map(([ch]) => ch);
      if (fits.length >= 3) return fits;
      const narrow = [...hex, ...slim].filter(([, cw]) => cw <= w * 1.12).map(([ch]) => ch);
      return narrow.length ? narrow : ['|'];
    });
  };

  /** Decode the name out of hex, glyph by glyph, keeping every glyph at its kerned position. */
  const decode = () => {
    if (running || !textEl.firstChild) return;
    running = true;

    // The name spans several text nodes (the f–t kern pair); walk them all, char by char.
    const slots: { node: Text; i: number }[] = [];
    const walker = document.createTreeWalker(textEl, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
      for (let i = 0; i < n.length; i++) slots.push({ node: n, i });
    }

    const origin = heading.getBoundingClientRect();
    const range = document.createRange();
    const glyphs: { el: HTMLSpanElement; ch: string; pool: string[]; settle: number }[] = [];
    const chars = slots.map(({ node, i }) => node.data[i]);
    const boxes = slots.map(({ node, i }) => {
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      return range.getBoundingClientRect();
    });
    const pools = poolsFor(boxes.map((b) => b.width));

    layer.replaceChildren();
    chars.forEach((ch, i) => {
      const el = document.createElement('span');
      el.style.left = `${boxes[i].left - origin.left}px`;
      el.textContent = ch === ' ' ? ' ' : pick(pools[i]);
      layer.append(el);
      glyphs.push({ el, ch, pool: pools[i], settle: 260 + i * 70 + Math.random() * 140 });
    });

    heading.classList.add('decoding');
    const start = performance.now();
    let last = 0;

    const tick = (now: number) => {
      const t = now - start;
      const swap = now - last > 48;
      if (swap) last = now;
      let done = true;
      for (const g of glyphs) {
        if (g.ch === ' ') continue;
        if (t >= g.settle) {
          if (g.el.textContent !== g.ch) g.el.textContent = g.ch;
        } else {
          done = false;
          if (swap) g.el.textContent = pick(g.pool);
        }
      }
      if (done) {
        heading.classList.remove('decoding');
        layer.replaceChildren();
        running = false;
      } else {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  };

  onMount(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.fonts.ready.then(decode);
  });
</script>

<h1 class="wordmark" bind:this={heading} onpointerenter={(e) => e.pointerType === 'mouse' && decode()}>
  <span class="text" bind:this={textEl}
    >{#if kern === -1}{text}{:else}{text.slice(0, kern)}<span class="kern">f</span>{text.slice(kern + 1)}{/if}</span
  >
  <span class="layer" aria-hidden="true" bind:this={layer}></span>
</h1>

<style>
  .wordmark {
    position: relative;
    /* Ink is ~4.68em wide at this tracking (measured in render); D's side bearing is 0.047em. Both edges land on the column. */
    margin: 0 0 0 -0.047em;
    color: var(--ink);
    font-size: calc(100cqi / 4.676);
    font-weight: 700;
    line-height: 0.86;
    letter-spacing: -0.04em;
    white-space: nowrap;
    text-wrap: nowrap;
  }

  /* f's advance pulls t in until the crossbars overlap by ~0.016em: >=1px down to a 320px screen. */
  .kern {
    letter-spacing: -0.062em;
  }

  .layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .layer :global(span) {
    position: absolute;
    top: 0;
  }

  .wordmark:global(.decoding) .text {
    color: transparent;
  }
</style>
