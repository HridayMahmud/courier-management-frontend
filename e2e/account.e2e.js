// Account settings: change name and password from the UI, sign in with the new password.
const { chromium } = require('playwright');
const { BASE, TIMEOUT, check, finish, signIn, apiCall, uid } = require('./helpers');

(async () => {
  const email = `e2e_acct_${uid()}@example.test`;
  const reg = await apiCall('POST', '/api/auth/register', { body: { name: 'E2E Account', email, password: 'First#2026' } });
  if (reg.status !== 201) throw new Error('could not create test user: ' + JSON.stringify(reg.data));

  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 860 } })).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  console.log('Account settings');

  await signIn(page, { email, password: 'First#2026' }, '/dashboard');
  await page.getByRole('button', { name: /E2E Account/ }).click();
  await page.getByRole('menuitem', { name: 'Account settings' }).click();
  await page.waitForURL('**/account', { timeout: TIMEOUT });
  check('user menu opens /account', true);
  const myParcels = page.locator('aside').getByRole('link', { name: 'My parcels' });
  await myParcels.waitFor({ timeout: TIMEOUT }).catch(() => {});
  check('customer menu stays visible on /account', await myParcels.isVisible());

  await page.getByLabel('Full name').fill('E2E Renamed');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByText('Name updated').waitFor({ timeout: TIMEOUT });
  check('name updated and shown in header', await page.getByRole('button', { name: /E2E Renamed/ }).isVisible());

  await page.getByLabel('Current password').fill('wrong-one');
  await page.getByLabel('New password').fill('Second#2026');
  await page.getByLabel('Confirm password').fill('Second#2026');
  await page.getByRole('button', { name: 'Update password' }).click();
  await page.getByText('Current password is incorrect').waitFor({ timeout: TIMEOUT }).catch(() => {});
  check('wrong current password is rejected', await page.getByText('Current password is incorrect').isVisible());

  await page.getByLabel('Current password').fill('First#2026');
  await page.getByRole('button', { name: 'Update password' }).click();
  await page.getByText('Password changed').waitFor({ timeout: TIMEOUT });
  check('password changed', true);

  const oldLogin = await apiCall('POST', '/api/auth/login', { body: { email, password: 'First#2026' } });
  const newLogin = await apiCall('POST', '/api/auth/login', { body: { email, password: 'Second#2026' } });
  check('old password rejected, new password accepted', oldLogin.status === 401 && newLogin.status === 200, [oldLogin.status, newLogin.status]);

  await page.context().clearCookies();
  await page.goto(BASE + '/account');
  await page.waitForURL(/\/login/, { timeout: TIMEOUT });
  check('signed-out visitor is sent to /login', new URL(page.url()).pathname === '/login');

  check('no uncaught page errors', errors.length === 0, errors);
  await browser.close();
  finish();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
