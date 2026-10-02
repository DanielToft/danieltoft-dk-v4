// @ts-check
/**
 * The performance test: Lighthouse on the built site, every category held to a floor. It runs after
 * `astro build` on each deploy; a score under the floor fails the run, and nothing is deployed. The scores and
 * the full report go next to the page (`dist/lighthouse.json`, `dist/lighthouse.html`), where `git blame` on
 * "performance" shows them: the page proves the line.
 */
import { execSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { preview } from 'astro';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

/** The lowest score, out of 100, any category may have. */
const FLOOR = 95;
const PORT = 4322;
/** The four the page shows. Newer categories stay out, so the deploy never fails on one nobody sees. */
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

const commit = process.env.GITHUB_SHA ?? execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();

const server = await preview({ server: { port: PORT }, logLevel: 'error' });
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });

try {
  // Lighthouse's default run: a mid-range phone on a throttled connection, the harder of its two presets.
  const result = await lighthouse(`http://localhost:${PORT}/`, {
    port: chrome.port,
    output: 'html',
    logLevel: 'error',
    onlyCategories: CATEGORIES,
  });
  if (!result) throw new Error('Lighthouse returned no result');
  const { lhr, report } = result;

  const scores = Object.fromEntries(
    Object.values(lhr.categories).map((category) => [category.id, Math.round((category.score ?? 0) * 100)]),
  );
  await writeFile('dist/lighthouse.html', Array.isArray(report) ? report[0] : report);
  await writeFile(
    'dist/lighthouse.json',
    JSON.stringify({ commit, ranAt: lhr.fetchTime, formFactor: lhr.configSettings.formFactor, floor: FLOOR, scores }),
  );

  const low = Object.entries(scores).filter(([, score]) => score < FLOOR);
  console.log(Object.entries(scores).map(([id, score]) => `${id} ${score}`).join(' · '));
  if (low.length) {
    console.error(`Under ${FLOOR}: ${low.map(([id, score]) => `${id} ${score}`).join(', ')}`);
    process.exitCode = 1;
  }
} finally {
  await chrome.kill();
  await server.stop();
}
