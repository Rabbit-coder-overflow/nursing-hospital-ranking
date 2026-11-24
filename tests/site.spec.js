import { expect, test } from '@playwright/test'

test('searches and combines configurable filters, then resets them', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('note')).toContainText('115 學年度（N49）畢業生就業推薦訊息。')
  await expect(page.getByRole('note')).toContainText('實際推薦名額、篩選標準與待遇請以各院最新來文及學校公告為準。')
  await expect(page.getByText('找到 11 間院所')).toBeVisible()
  await page.screenshot({ path: 'playwright-screenshots/home.png', fullPage: true })
  await expect(page.getByLabel('加班情況')).toHaveCount(0)
  await expect(page.getByLabel('輪班方式')).toHaveCount(0)
  await expect(page.getByLabel('排班彈性')).toHaveCount(0)

  await page.getByLabel('操行成績').fill('75')
  await expect(page.getByText('找到 1 間院所')).toBeVisible()
  await expect(page.getByRole('heading', { name: '新竹馬偕紀念醫院（新竹馬偕）' })).toBeVisible()
  await page.getByRole('button', { name: '清除全部' }).click()
  await expect(page.getByLabel('操行成績')).toHaveValue('')

  await page.getByLabel('院所縣市').selectOption('north')
  await expect(page.getByText('找到 7 間院所')).toBeVisible()
  await expect(page.getByRole('heading', { name: '三軍總醫院（三軍總）' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '臺大醫院（臺大附醫）' })).toBeVisible()

  await page.getByLabel('宿舍').selectOption('needed')
  await expect(page.getByText('找到 3 間院所')).toBeVisible()
  await expect(page.getByRole('heading', { name: '三軍總醫院（三軍總）' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '臺北榮民總醫院（北榮）' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '臺大醫院（臺大附醫）' })).toBeVisible()

  await page.getByLabel('搜尋院所或縣市').fill('高雄')
  await expect(page.getByText('沒有符合條件的院所')).toBeVisible()
  await page.getByRole('button', { name: '清除全部' }).click()
  await expect(page.getByText('找到 11 間院所')).toBeVisible()
  await expect(page.getByLabel('搜尋院所或縣市')).toHaveValue('')
  await expect(page.getByLabel('院所縣市')).toHaveValue('')
  await expect(page.getByLabel('宿舍')).toHaveValue('')

  await page.getByLabel('學業成績').fill('72')
  await page.getByLabel('實習成績').fill('75')
  await expect(page.getByText('找到 2 間院所')).toBeVisible()
  await expect(page.getByRole('heading', { name: '臺中榮民總醫院（中榮，含埔里及嘉義分院）' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '新竹馬偕紀念醫院（新竹馬偕）' })).toBeVisible()

  await page.getByLabel('學業成績').fill('75')
  await page.getByLabel('實習成績').fill('75')
  await page.getByLabel('操行成績').fill('80')
  await page.getByLabel('特殊工作單位').selectOption('icu')
  await expect(page.getByText('找到 1 間院所')).toBeVisible()
  await expect(page.getByRole('heading', { name: '三軍總醫院（三軍總）' })).toBeVisible()

  await page.getByLabel('學業成績').fill('65')
  await expect(page.getByText('沒有符合條件的院所')).toBeVisible()

  await page.getByRole('button', { name: '清除全部' }).click()
  await expect(page.getByText('找到 11 間院所')).toBeVisible()
  await expect(page.getByLabel('學業成績')).toHaveValue('')
  await expect(page.getByLabel('實習成績')).toHaveValue('')

  await page.getByLabel('其他').fill('簽約金')
  await expect(page.getByText('找到 2 間院所')).toBeVisible()
  await expect(page.getByRole('heading', { name: '彰化基督教醫院（彰基）' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '中山醫學大學附設醫院（中山附醫）' })).toBeVisible()

  await page.getByRole('button', { name: '清除全部' }).click()
  await expect(page.getByLabel('其他')).toHaveValue('')

  await page.getByLabel('薪資').fill('45000')
  await expect(page.getByText('找到 3 間院所')).toBeVisible()
  await expect(page.getByRole('heading', { name: '三軍總醫院（三軍總）' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '臺大醫院（臺大附醫）' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '新竹臺大分院（新竹台大）' })).toBeVisible()

  await page.getByRole('button', { name: '清除全部' }).click()
  await expect(page.getByLabel('薪資')).toHaveValue('')

  await page.getByLabel('院所性質').selectOption('cancer_specialty')
  await expect(page.getByText('找到 1 間院所')).toBeVisible()
  await expect(page.getByRole('heading', { name: '臺大癌醫中心分院（台大癌醫）' })).toBeVisible()

  await page.getByRole('button', { name: '清除全部' }).click()
  await page.getByLabel('搜尋院所或縣市').fill('北榮')
  await expect(page.getByRole('heading', { name: '臺北榮民總醫院（北榮）' })).toBeVisible()
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
