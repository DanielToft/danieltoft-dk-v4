// @ts-check
/**
 * The CV as a PDF: the built page, printed by Chrome through the print stylesheet. It runs after `astro build`
 * on each deploy, so the PDF is always the page as it is live. The page links to it under LinkedIn.
 */
import { execFile } from 'node:child_process';
import { statSync } from 'node:fs';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { preview } from 'astro';
import { Launcher } from 'chrome-launcher';

const PORT = 4322;
/** Also the name it saves under, so it reads as a CV in someone's downloads. */
const OUT = resolve('dist/daniel-toft-cv.pdf');

const chrome = Launcher.getFirstInstallation();
if (!chrome) throw new Error('No Chrome to print the CV with');

const server = await preview({ server: { port: PORT }, logLevel: 'error' });
try {
  // The print stylesheet sets A4 and leaves no page margin, so Chrome adds no header or footer of its own.
  // Async: the preview server answering Chrome runs in this process, and a sync call would block it.
  await promisify(execFile)(
    chrome,
    [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--no-pdf-header-footer',
      '--virtual-time-budget=5000',
      `--print-to-pdf=${OUT}`,
      `http://localhost:${PORT}/`,
    ],
    { timeout: 60_000 },
  );
  console.log(`CV: ${OUT} (${Math.round(statSync(OUT).size / 1000)} kB)`);
} finally {
  await server.stop();
}
