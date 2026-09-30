// Tiny helpers shared by the browser tests. See e2e/run.js for how they are run.
const BASE = (process.env.E2E_BASE_URL || 'http://localhost:5001').replace(/\/$/, '');
const API = (process.env.E2E_API_URL || 'http://localhost:4000').replace(/\/$/, '');
const TIMEOUT = Number(process.env.E2E_TIMEOUT || 30000);

// demo accounts created by `npm run seed:demo` in the backend
const DEMO = {
  admin: { email: 'admin@swiftship.test', password: 'Admin@123' },
  courier: { email: 'courier@swiftship.test', password: 'Courier@123', name: 'Rafiq Hasan' },
  customer: { email: 'customer@swiftship.test', password: 'Customer@123' },
};

let passed = 0;
let failed = 0;
function check(name, ok, detail) {
  if (ok) {
    passed++;
    console.log('  PASS', name);
  } else {
    failed++;
    console.log('  FAIL', name, detail === undefined ? '' : JSON.stringify(detail).slice(0, 300));
  }
}
function finish() {
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

async function signIn(page, { email, password }, home) {
  await page.goto(BASE + '/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL(`**${home}`, { timeout: TIMEOUT });
}

async function apiCall(method, path, { body, token } = {}) {
  const res = await fetch(API + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json().catch(() => null) };
}

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

module.exports = { BASE, API, TIMEOUT, DEMO, check, finish, signIn, apiCall, uid };
