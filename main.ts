// The World in One Day — entry for make.fun's news-image-20261118 bounty,
// "Sum up 18 November's world news in one image".
//
// The repository holds the poster beside this file as "entry.png" (uploaded
// through the GitHub web UI). It sums up Wednesday 18 November 2026 — Xi
// Jinping and Vladimir Putin meeting in Shenzhen as APEC opened, with Donald
// Trump landing for Thursday's trilateral; Iranian drones targeting US bases
// in the Gulf; Mary Peltola flipping Alaska to give Democrats the Senate
// 56–44; Nvidia's revenue doubling to $115.8B; 141 drones over Ukraine in one
// night; Cyclone Akvan closing on Andhra Pradesh; and 950,000 displaced
// people in Gaza facing a flooded winter. This program copies that image to
// the output directory untouched, so both graded runs write exactly the
// same bytes.
//
// Composition pass v2: the Gulf and Ukraine cards use focal crops that keep
// the drones in frame, and the ticker carries six items.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const plain = new URL('./entry.png', import.meta.url);
const spaced = new URL('./entry poster.png', import.meta.url);
const source = existsSync(plain) ? plain : spaced;
const target = join(outDir, 'entry.png');

const bytes = readFileSync(source);

// The gate reads the image by its first bytes, not its name: accept a whole
// PNG or JPEG of at most 1 MiB, and refuse anything else rather than write a
// file the scorer would mark invalid.
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const isPng = PNG_MAGIC.every((b, i) => bytes[i] === b);
const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[bytes.length - 2] === 0xff && bytes[bytes.length - 1] === 0xd9;
if (!isPng && !isJpeg) {
  throw new Error('entry.png is neither a PNG nor a JPEG image');
}
if (bytes.length > 1_048_576) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB limit`);
}

writeFileSync(target, bytes);
console.log(`wrote ${target}: ${bytes.length} bytes (${isPng ? 'PNG' : 'JPEG'})`);
