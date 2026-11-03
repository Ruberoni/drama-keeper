import { expect, test } from '@playwright/test'

// Register, log in, add a film and delete it. Google sign-in cannot run here.
test('register, log in, add and delete a film', async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`
  const password = 'e2e-password'
  const title = `E2E Film ${Date.now()}`

  // The app reports results with alert(); accept them so they never block the test.
  page.on('dialog', (dialog) => dialog.accept())

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'To see' })).toBeVisible()

  // Register
  await page.getByRole('button', { name: 'Register' }).click()
  const registerDialog = page.locator('.modal')
  await registerDialog.locator('input[name="email"]').fill(email)
  await registerDialog.locator('input[name="password"]').fill(password)
  await registerDialog.locator('input[name="passwordConfirmation"]').fill(password)
  const registered = page.waitForResponse(
    (r) => r.url().endsWith('/api/users') && r.request().method() === 'POST',
  )
  await registerDialog.getByRole('button', { name: 'Register' }).click()
  expect((await registered).status()).toBe(200)
  await page.keyboard.press('Escape')

  // Log in
  await page.getByRole('button', { name: 'Login' }).click()
  const loginDialog = page.locator('.modal')
  await loginDialog.locator('input[name="email"]').fill(email)
  await loginDialog.locator('input[name="password"]').fill(password)
  await loginDialog.getByRole('button', { name: 'Login', exact: true }).click()
  await expect(page.getByLabel('account of current user')).toBeVisible()
  await page.keyboard.press('Escape')

  // Add a film
  await page.getByRole('button', { name: 'add' }).click()
  const createDialog = page.locator('.modal')
  await createDialog.locator('input[name="title"]').fill(title)
  await createDialog.locator('input[value="Movie"]').check()
  await createDialog.getByRole('button', { name: 'Create' }).click()
  await page.keyboard.press('Escape')
  await expect(page.getByText(title)).toBeVisible()

  // Delete it
  const card = page.locator('.MuiCard-root', { hasText: title })
  await card.getByRole('button').click()
  await page.getByRole('menuitem', { name: 'Delete' }).click()
  await expect(page.getByText(title)).toHaveCount(0)
})
