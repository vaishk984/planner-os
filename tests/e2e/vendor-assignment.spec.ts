import { test, expect } from '@playwright/test'

const plannerEmail = process.env.E2E_PLANNER_EMAIL
const plannerPassword = process.env.E2E_PLANNER_PASSWORD
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const defaultVendorPassword = process.env.E2E_VENDOR_PASSWORD || 'password123'

const requireEnv = (key: string, value?: string) => {
  if (!value) {
    throw new Error(`Missing required env var: ${key}`)
  }
  return value
}

async function login(page: any, email: string, password: string) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: /sign in/i }).click()
}

async function logout(page: any) {
  await page.goto('/logout')
}

async function signupVendor(page: any, email: string, password: string, vendorName: string) {
  await page.goto('/signup')
  await page.getByRole('button', { name: /vendor/i }).click()
  await page.getByLabel('Full Name').fill(vendorName)
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.locator('#category_id').selectOption('catering')
  await page.getByRole('button', { name: /create account/i }).click()

  await page.waitForLoadState('networkidle')

  // If email confirmation is required, signup will redirect to /login
  const currentUrl = page.url()
  if (currentUrl.includes('/login')) {
    throw new Error('Vendor signup redirected to /login. Email confirmation might be required. Provide a verified vendor account or disable email confirmation in Supabase.')
  }
}

async function createIntake(request: any, payload: Record<string, unknown>) {
  const url = `${requireEnv('NEXT_PUBLIC_SUPABASE_URL', supabaseUrl)}/rest/v1/event_intakes`
  const anonKey = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', supabaseAnonKey)

  const res = await request.post(url, {
    data: payload,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
  })

  if (!res.ok()) {
    const body = await res.text()
    throw new Error(`Failed to create intake: ${res.status()} ${body}`)
  }

  const json = await res.json()
  return Array.isArray(json) ? json[0] : json
}

test.describe('Planner ↔ Vendor assignment flow', () => {
  test('planner assigns vendor and vendor can accept/decline', async ({ page, request }) => {
    const email = requireEnv('E2E_PLANNER_EMAIL', plannerEmail)
    const password = requireEnv('E2E_PLANNER_PASSWORD', plannerPassword)

    const vendorEmail = process.env.E2E_VENDOR_EMAIL || `e2e.vendor.${Date.now()}@example.com`
    const vendorPassword = defaultVendorPassword
    const vendorName = `E2E Vendor ${Date.now()}`

    // Ensure vendor exists
    await signupVendor(page, vendorEmail, vendorPassword, vendorName)
    await expect(page).toHaveURL(/\/vendor/)
    await logout(page)

    // Create a public intake to convert into an event
    const token = `e2e_${Date.now().toString(36)}`
    const clientName = `E2E Client ${Date.now()}`
    const eventDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    await createIntake(request, {
      client_name: clientName,
      client_phone: '9999999999',
      status: 'submitted',
      requirements: {
        token,
        eventType: 'wedding',
        eventDate,
        guestCount: 150,
        budgetMin: 1000000,
        budgetMax: 2000000,
        city: 'Mumbai',
        clientName,
        phone: '9999999999',
      },
    })

    // Login as planner
    await login(page, email, password)
    await page.waitForURL(/\/planner/)

    await page.goto('/planner/events')
    await expect(page.getByText(clientName)).toBeVisible({ timeout: 60000 })

    const intakeCard = page.locator('div', { hasText: clientName }).filter({
      has: page.getByRole('button', { name: /convert to event/i }),
    }).first()

    await intakeCard.getByRole('button', { name: /convert to event/i }).click()

    const eventCard = page.locator('div', { hasText: clientName }).filter({
      has: page.getByRole('button', { name: /open workspace/i }),
    }).first()

    await expect(eventCard.getByRole('button', { name: /open workspace/i })).toBeVisible({ timeout: 60000 })
    await eventCard.getByRole('button', { name: /open workspace/i }).click()

    await page.getByRole('link', { name: 'Vendors' }).click()
    await expect(page.getByRole('button', { name: /assign vendor/i })).toBeVisible()

    // Create two booking requests (one to accept, one to decline)
    for (const category of ['Catering', 'Photography']) {
      await page.getByRole('button', { name: /assign vendor/i }).click()

      const dialog = page.getByRole('dialog')
      const comboBoxes = dialog.getByRole('combobox')

      await comboBoxes.nth(0).click()
      await page.getByRole('option', { name: new RegExp(vendorName, 'i') }).click()

      await comboBoxes.nth(1).click()
      await page.getByRole('option', { name: new RegExp(category, 'i') }).click()

      await comboBoxes.nth(2).click()
      await page.getByRole('option', { name: /quote requested/i }).click()

      await dialog.getByLabel('Notes').fill(`E2E request for ${category}`)
      await dialog.getByRole('button', { name: /^Assign Vendor$/i }).click()

      await expect(page.getByText(vendorName)).toBeVisible()
    }

    await logout(page)

    // Login as vendor
    await login(page, vendorEmail, vendorPassword)
    await page.waitForURL(/\/vendor/)

    const requestCard = page.locator('div', { hasText: clientName }).first()
    await expect(requestCard).toBeVisible({ timeout: 60000 })

    // Verify key details are visible (date, city, guests, budget, service)
    await expect(requestCard.getByText('Mumbai')).toBeVisible()
    await expect(requestCard.getByText(/guests/i)).toBeVisible()
    await expect(requestCard.getByText(/₹/)).toBeVisible()
    await expect(requestCard.getByText(/Service:/i)).toBeVisible()

    // Accept first request
    await requestCard.getByRole('button', { name: /accept/i }).click()

    // Decline another request if present
    const secondCard = page.locator('div', { hasText: clientName }).nth(1)
    if (await secondCard.isVisible()) {
      await secondCard.getByRole('button', { name: /decline/i }).click()
    }
  })

  test('notification bell shows notification list', async ({ page }) => {
    const vendorEmail = process.env.E2E_VENDOR_EMAIL
    const vendorPassword = process.env.E2E_VENDOR_PASSWORD
    if (!vendorEmail || !vendorPassword) {
      test.skip(true, 'E2E_VENDOR_EMAIL and E2E_VENDOR_PASSWORD required for this test')
    }

    await login(page, vendorEmail!, vendorPassword!)
    await page.waitForURL(/\/vendor/)

    const bellButton = page.locator('button:has(svg[data-lucide="bell"])')
    await expect(bellButton).toBeVisible()
    await bellButton.click()

    // Expect a notifications list or empty state to appear
    await expect(page.getByText(/notifications/i)).toBeVisible()
  })
})
