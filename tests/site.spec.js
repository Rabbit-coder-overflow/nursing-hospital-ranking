import { expect, test } from '@playwright/test'

test('searches and combines configurable filters, then resets them', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('note')).toContainText('示範資料')
  await expect(page.getByText('找到 4 間院所')).toBeVisible()
  await expect(page.getByLabel('加班情況')).toHaveCount(0)

  await page.getByLabel('院所縣市').selectOption('north')
  await expect(page.getByText('找到 2 間院所')).toBeVisible()
  await expect(page.getByRole('heading', { name: '三軍總醫院' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '範例醫院 A' })).toBeVisible()

  await page.getByLabel('學業成績').fill('80')
  await page.getByLabel('實習成績').fill('80')
  await expect(page.getByText('找到 1 間院所')).toBeVisible()
  await expect(page.getByRole('heading', { name: '三軍總醫院' })).toBeVisible()

  await page.getByLabel('學業成績').fill('70')
  await expect(page.getByText('沒有符合條件的院所')).toBeVisible()

  await page.getByRole('button', { name: '清除全部' }).click()
  await expect(page.getByText('找到 4 間院所')).toBeVisible()
  await expect(page.getByLabel('學業成績')).toHaveValue('')
  await expect(page.getByLabel('實習成績')).toHaveValue('')

  await page.getByLabel('其他').fill('交班')
  await expect(page.getByText('找到 1 間院所')).toBeVisible()
  await expect(page.getByRole('heading', { name: '三軍總醫院' })).toBeVisible()

  await page.getByRole('button', { name: '清除全部' }).click()
  await expect(page.getByLabel('其他')).toHaveValue('')

  await page.getByLabel('排班彈性').selectOption('fixed')
  await expect(page.getByText('找到 2 間院所')).toBeVisible()
  await page.getByLabel('宿舍').selectOption('needed')
  await expect(page.getByText('找到 1 間院所')).toBeVisible()
  await expect(page.getByRole('heading', { name: '範例醫院 A' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '範例醫院 C' })).toHaveCount(0)

  await page.getByLabel('搜尋院所或縣市').fill('高雄')
  await expect(page.getByText('沒有符合條件的院所')).toBeVisible()
  await page.getByRole('button', { name: '清除全部' }).click()
  await expect(page.getByText('找到 4 間院所')).toBeVisible()
  await expect(page.getByLabel('搜尋院所或縣市')).toHaveValue('')
  await expect(page.getByLabel('排班彈性')).toHaveValue('')
  await expect(page.getByLabel('宿舍')).toHaveValue('')

  await page.getByLabel('薪資').fill('48000')
  await expect(page.getByText('找到 3 間院所')).toBeVisible()
  await expect(page.getByRole('heading', { name: '範例醫院 B' })).toHaveCount(0)

  await page.getByLabel('院所性質').selectOption('cancer_specialty')
  await page.getByLabel('特殊工作單位').selectOption('operating_room')
  await page.getByLabel('新人獎助學金').selectOption('needed')
  await expect(page.getByText('找到 1 間院所')).toBeVisible()
  await expect(page.getByRole('heading', { name: '範例醫院 C' })).toBeVisible()

  await page.getByRole('button', { name: '清除全部' }).click()
  await expect(page.getByLabel('薪資')).toHaveValue('')
  await page.getByLabel('搜尋院所或縣市').fill('台中')
  await expect(page.getByRole('heading', { name: '範例醫院 B' })).toBeVisible()
  await expect(page.getByText('找到 1 間院所')).toBeVisible()
})

test('uses the system theme and remembers a manual choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('./')
  await expect(page.locator('#root > div')).toHaveClass(/(?:^|\s)dark(?:\s|$)/)
  const darkBackground = await page.locator('#root > div').evaluate((element) => getComputedStyle(element).backgroundColor)
  await page.getByRole('button', { name: '切換淺色模式' }).click()
  await expect(page.locator('#root > div')).not.toHaveClass(/(?:^|\s)dark(?:\s|$)/)
  await expect(page.locator('#root > div')).not.toHaveCSS('background-color', darkBackground)
  await page.reload()
  await expect(page.locator('#root > div')).not.toHaveClass(/(?:^|\s)dark(?:\s|$)/)
  await page.getByRole('button', { name: '切換深色模式' }).click()
  await expect(page.locator('#root > div')).toHaveClass(/(?:^|\s)dark(?:\s|$)/)
})
