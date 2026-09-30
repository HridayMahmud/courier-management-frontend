// npm run test:e2e — runs every e2e/*.e2e.js file against a running app.
// Needs: backend on :4000 with `npm run seed:demo`, this frontend on :5001,
// and a browser once: `npx playwright install chromium`.
// Override addresses with E2E_BASE_URL / E2E_API_URL.
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter((f) => f.endsWith('.e2e.js')).sort();
let passed = 0;
let failed = 0;
for (const f of files) {
  const res = spawnSync(process.execPath, [path.join(__dirname, f)], { encoding: 'utf8', env: process.env });
  process.stdout.write(res.stdout);
  if (res.stderr) process.stderr.write(res.stderr);
  const m = res.stdout.match(/(\d+) passed, (\d+) failed/);
  passed += m ? +m[1] : 0;
  failed += m ? +m[2] : 1;
}
console.log(`\nTOTAL: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
