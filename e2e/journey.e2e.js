// The whole flow through the UI: customer books -> admin assigns -> courier delivers -> public tracking.
const { chromium } = require('playwright');
const { BASE, TIMEOUT, DEMO, check, finish, signIn, apiCall, uid } = require('./helpers');

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const newPage = async (viewport) => {
    const page = await (await browser.newContext({ viewport })).newPage();
    page.on('pageerror', (e) => errors.push(e.message));
    return page;
  };
  console.log('Journey: customer -> admin -> courier -> tracking');

  const customer = await newPage({ width: 1280, height: 860 });
  await customer.goto(BASE + '/register');
  await customer.getByLabel('Full name').fill('E2E Customer');
  await customer.getByLabel('Email').fill(`e2e_${uid()}@example.test`);
  await customer.getByLabel('Password', { exact: true }).fill('E2eTest#2026');
  await customer.getByLabel('Confirm password').fill('E2eTest#2026');
  await customer.getByRole('button', { name: 'Create account' }).click();
  await customer.waitForURL('**/dashboard', { timeout: TIMEOUT });
  check('customer registered and signed in', true);

  await customer.goto(BASE + '/dashboard/parcels/new');
  const next = () => customer.getByRole('button', { name: 'Next', exact: true }).click();
  await customer.getByLabel('Pickup address').fill('Road 11, Banani, Dhaka');
  await next();
  await customer.getByLabel('Receiver name').fill('Arif Hossain');
  await customer.getByLabel('Receiver phone').fill('01555123456');
  await customer.getByLabel('Delivery address').fill('Shibbari, Khulna');
  await next();
  const item = `E2E guitar ${uid()}`;
  await customer.getByLabel('Item').fill(item);
  await customer.getByLabel('Weight (kg)').fill('4');
  await next();
  await customer.getByRole('button', { name: 'Book parcel' }).click();
  await customer.getByText('Parcel booked!').waitFor({ timeout: TIMEOUT });
  const trackingId = (await customer.locator('.font-mono.text-2xl').innerText()).trim();
  check('parcel booked with tracking id', /^SS-[A-Z0-9]{8}$/.test(trackingId), trackingId);

  const admin = await newPage({ width: 1440, height: 900 });
  await signIn(admin, DEMO.admin, '/admin');
  await admin.goto(BASE + '/admin/parcels');
  await admin.getByPlaceholder('Search tracking ID').fill(trackingId);
  await admin.getByRole('link', { name: item }).click({ timeout: TIMEOUT });
  await admin.getByRole('button', { name: 'Assign courier' }).click();
  await admin.getByRole('dialog').getByRole('radio', { name: new RegExp(DEMO.courier.name) }).click();
  await admin.getByRole('dialog').getByRole('button', { name: 'Assign', exact: true }).click();
  await admin.getByText('Courier assigned').waitFor({ timeout: TIMEOUT });
  check('admin assigned the courier', true);

  const courier = await newPage({ width: 390, height: 844 });
  await signIn(courier, DEMO.courier, '/courier');
  const card = courier.locator('article', { hasText: item });
  await card.waitFor({ timeout: TIMEOUT });
  for (const [button, status] of [['Mark picked up', 'Picked up'], ['Start transit', 'In transit'], ['Out for delivery', 'Out for delivery']]) {
    await card.getByRole('button', { name: button }).click();
    await courier.getByText(`Updated to ${status}`).last().waitFor({ timeout: TIMEOUT });
  }
  await card.getByRole('button', { name: 'Mark delivered' }).click();
  await courier.getByRole('button', { name: 'Confirm' }).click();
  await courier.getByText('Updated to Delivered').waitFor({ timeout: TIMEOUT });
  check('courier moved it to Delivered', true);

  const visitor = await newPage({ width: 1280, height: 860 });
  await visitor.goto(`${BASE}/track/${trackingId}`);
  await visitor.getByText('Delivered. Thank you').waitFor({ timeout: TIMEOUT });
  const track = await apiCall('GET', `/api/parcel/track/${trackingId}`);
  check(
    'public tracking shows all 5 steps',
    track.data?.statusHistory?.map((h) => h.status).join(',') === 'pending,picked_up,in_transit,out_for_delivery,delivered',
    track.data,
  );

  check('no uncaught page errors', errors.length === 0, errors);
  await browser.close();
  finish();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
