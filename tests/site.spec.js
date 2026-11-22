import { expect, test } from '@playwright/test'

test('searches and combines configurable filters, then resets them', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('note')).toContainText('示範資料')
  await expect(page.getByText('找到 3 間院所')).toBeVisible()

  await page.getByLabel('輪班方式').selectOption('rotating')
  await expect(page.getByText('找到 2 間院所')).toBeVisible()
  await page.getByLabel('加班情況').selectOption('rare')
  await expect(page.getByText('找到 1 間院所')).toBeVisible()
  await expect(page.getByRole('heading', { name: '範例醫院 C' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '範例醫院 B' })).toHaveCount(0)

  await page.getByLabel('搜尋院所或縣市').fill('台北')
  await expect(page.getByText('沒有符合條件的院所')).toBeVisible()
  await page.getByRole('button', { name: '清除全部' }).click()
  await expect(page.getByText('找到 3 間院所')).toBeVisible()
  await expect(page.getByLabel('搜尋院所或縣市')).toHaveValue('')
  await expect(page.getByLabel('輪班方式')).toHaveValue('')

  await page.getByLabel('搜尋院所或縣市').fill('台中')
  await expect(page.getByRole('heading', { name: '範例醫院 B' })).toBeVisible()
  await expect(page.getByText('找到 1 間院所')).toBeVisible()
})
