import { expect, test, type Page } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Captures the main screens at desktop and mobile widths for a visual check of UI library upgrades.
// The images land in client/screenshots/ and CI uploads them as the `screenshots` workflow artifact.
// It also checks that the "Already seen?" checkbox in the add-film form still saves.

const here = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(here, '..', 'screenshots')
const coverFixture = path.join(here, '..', 'src', 'assets', 'img', 'when-harry-met-sally-cover.jpg')
const apiUrl = 'http://localhost:4000'

const viewports = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 375, height: 740 },
]

// Escape can be swallowed while an alert() is still being dismissed, so retry until the modal is gone.
async function closeModal(page: Page) {
  await expect(async () => {
    await page.keyboard.press('Escape')
    await expect(page.locator('.modal')).toBeHidden({ timeout: 1000 })
  }).toPass()
}

async function shoot(page: Page, viewport: string, name: string) {
  // Let MUI transitions (modal fade, menu grow, ripples) settle.
  await page.waitForTimeout(600)
  await page.screenshot({ path: path.join(outDir, `${viewport}-${name}.png`), fullPage: true })
}

async function addFilm(page: Page, title: string, watched: boolean) {
  await page.getByRole('button', { name: 'add' }).click()
  const dialog = page.locator('.modal')
  await dialog.locator('input[name="title"]').fill(title)
  await dialog.locator('input[value="Movie"]').check()
  if (watched) {
    await dialog.getByText('Advanced settings').click()
    await dialog.locator('input[name="watched"]').check()
  }
  const created = page.waitForResponse(
    (r) => r.url().includes('/createfilmauthorized') && r.request().method() === 'POST',
  )
  await dialog.getByRole('button', { name: 'Create' }).click()
  expect((await created).status()).toBe(200)
  await closeModal(page)
}

for (const vp of viewports) {
  test.describe(`screenshots ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } })

    test(`main screens at ${vp.width}px`, async ({ page, request }) => {
      const stamp = `${vp.name}-${Date.now()}`
      const email = `shots-${stamp}@example.com`
      const password = 'shots-password'
      const unwatched = `Pending ${stamp}`
      const watched = `Watched ${stamp}`

      page.on('dialog', (dialog) => dialog.accept())
      // Covers come from third-party hosts; serve a local image so the shots are stable.
      await page.route(/images-na\.ssl-images-amazon\.com|image\.tmdb\.org/, (route) =>
        route.fulfill({ path: coverFixture, contentType: 'image/jpeg' }),
      )
      // Keep Google's sign-in button out of the shots; it can't load the dummy client id anyway.
      await page.route(/accounts\.google\.com/, (route) => route.abort())

      const registered = await request.post(`${apiUrl}/api/users`, { data: { email, password } })
      expect(registered.status()).toBe(200)

      // Logged-out home
      await page.goto('/')
      await expect(page.getByRole('heading', { name: 'To see' })).toBeVisible()
      await shoot(page, vp.name, '01-logged-out-home')

      // Login modal
      await page.getByRole('button', { name: 'Login' }).click()
      const loginDialog = page.locator('.modal')
      await shoot(page, vp.name, '02-login-modal')
      await loginDialog.locator('input[name="email"]').fill(email)
      await loginDialog.locator('input[name="password"]').fill(password)
      await loginDialog.getByRole('button', { name: 'Login', exact: true }).click()
      await expect(page.getByLabel('account of current user')).toBeVisible()
      await closeModal(page)

      // Add-film modal, with advanced settings open
      await page.getByRole('button', { name: 'add' }).click()
      await page.locator('.modal').getByText('Advanced settings').click()
      await shoot(page, vp.name, '03-add-film-modal')
      await closeModal(page)

      // One unwatched and one watched film; the watched one must land under "Seen".
      await addFilm(page, unwatched, false)
      await addFilm(page, watched, true)
      const toSee = page.locator('div.root', { has: page.getByRole('heading', { name: 'To see' }) })
      const seen = page.locator('div.root', { has: page.getByRole('heading', { name: 'Seen' }) })
      await expect(toSee.getByText(unwatched)).toBeVisible()
      await expect(seen.getByText(watched)).toBeVisible()
      await page.mouse.move(0, 0)
      await shoot(page, vp.name, '04-logged-in-home')

      // TopBar account menu
      await page.getByLabel('account of current user').click()
      await expect(page.getByRole('menuitem', { name: 'Logout' })).toBeVisible()
      await shoot(page, vp.name, '05-topbar-menu')
      await page.keyboard.press('Escape')

      // Film card menu
      await page.locator('.MuiCard-root', { hasText: watched }).getByRole('button').click()
      await expect(page.getByRole('menuitem', { name: 'Unwatch' })).toBeVisible()
      await shoot(page, vp.name, '06-film-menu')
    })
  })
}
