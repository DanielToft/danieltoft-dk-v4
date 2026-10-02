// @ts-check
/**
 * The performance test: Lighthouse on the built site, every category held to a floor. It runs after
 * `astro build` on each deploy; a score under the floor fails the run, and nothing is deployed. The scores and
 * the full report go next to the page (`dist/lighthouse.json`, `dist/lighthouse.html`), where `git blame` on
 * "performance" shows them: the page proves the line.
 *
 * CI machines are shared and slow, and one run there can lose several points the site doesn't (a single run
 * scored 94 where PageSpeed Insights gives 100). So it runs several times and takes each category's median,
 * as Lighthouse advises against that noise.
 */
import { execSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { preview } from 'astro';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

/** The lowest score, out of 100, any category may have: Lighthouse's own line for good, where it turns green. */
const FLOOR = 90;
const RUNS = 3;
const PORT = 4322;
/** The four the page shows. Newer categories stay out, so the deploy never fails on one nobody sees. */
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

const commit = process.env.GITHUB_SHA ?? execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();

const server = await preview({ server: { port: PORT }, logLevel: 'error' });
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });

try {
  // Lighthouse's default run: a mid-range phone on a throttled connection, the harder of its two presets.
  /** @type {(NonNullable<Awaited<ReturnType<typeof lighthouse>>> & { score: (id: string) => number })[]} */
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    const result = await lighthouse(`http://localhost:${PORT}/`, {
      port: chrome.port,
      output: 'html',
      logLevel: 'error',
      onlyCategories: CATEGORIES,
    });
    if (!result) throw new Error('Lighthouse returned no result');
    const score = (/** @type {string} */ id) => Math.round((result.lhr.categories[id]?.score ?? 0) * 100);
    runs.push({ ...result, score });
    console.log(`run ${i + 1}: ${CATEGORIES.map((id) => `${id} ${score(id)}`).join(' · ')}`);
  }

  const median = (/** @type {number[]} */ values) => values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
  const scores = Object.fromEntries(CATEGORIES.map((id) => [id, median(runs.map((run) => run.score(id)))]));
  // The report shown is the run with the median performance score.
  const { lhr, report } = runs.find((run) => run.score('performance') === scores.performance) ?? runs[0];
  await writeFile('dist/lighthouse.html', Array.isArray(report) ? report[0] : report);
  await writeFile(
    'dist/lighthouse.json',
    JSON.stringify({ commit, ranAt: lhr.fetchTime, formFactor: lhr.configSettings.formFactor, runs: RUNS, floor: FLOOR, scores }),
  );

  const low = Object.entries(scores).filter(([, score]) => score < FLOOR);
  console.log(`median: ${Object.entries(scores).map(([id, score]) => `${id} ${score}`).join(' · ')}`);
  if (low.length) {
    console.error(`Under ${FLOOR}: ${low.map(([id, score]) => `${id} ${score}`).join(', ')}`);
    process.exitCode = 1;
  }
} finally {
  await chrome.kill();
  await server.stop();
}
