import { createMemo, createSignal, For, Show } from 'solid-js'
import data from '../data/hospitals.json'

export default function App() {
  const [query, setQuery] = createSignal('')
  const [filters, setFilters] = createSignal({})
  const [dark, setDark] = createSignal(
    localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches),
  )
  const results = createMemo(() => {
    const search = query().trim().toLocaleLowerCase()
    return data.hospitals.filter((hospital) => {
      const matchesSearch = `${hospital.name} ${hospital.city}`.toLocaleLowerCase().includes(search)
      return matchesSearch && data.conditions.every((condition) => {
        const selected = (filters()[condition.id] || '').trim()
        if (!selected) return true
        const attr = hospital.attributes[condition.id]
        if (!attr || (Array.isArray(attr) && attr.length === 0)) return false
        if (condition.type === 'text') {
          const normalizedQuery = selected.replace(/,/g, '').toLocaleLowerCase()
          const normalizedAttr = String(attr).replace(/,/g, '').toLocaleLowerCase()
          if ((condition.compare === 'gte' || condition.compare === 'lte') && /^\d+$/.test(normalizedQuery)) {
            const firstMatch = normalizedAttr.match(/\d+/)
            if (!firstMatch) return false
            const attrNumber = Number(firstMatch[0])
            const queryNumber = Number(normalizedQuery)
            return condition.compare === 'lte' ? attrNumber <= queryNumber : attrNumber >= queryNumber
          }
          return normalizedAttr.includes(normalizedQuery)
        }
        return Array.isArray(attr) ? attr.includes(selected) : attr === selected
      })
    })
  })

  function reset() {
    setQuery('')
    setFilters({})
  }

  function toggleTheme() {
    const next = !dark()
    setDark(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <div class={['min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100', { dark: dark() }]}>
      <header class="bg-teal-900 text-white dark:bg-teal-950">
        <div class="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <div class="flex items-center justify-between gap-4">
            <p class="text-sm font-bold tracking-widest text-teal-200">台灣護理職涯</p>
            <button type="button" onClick={toggleTheme} class="rounded-lg border border-teal-200 px-3 py-2 text-sm font-semibold hover:bg-teal-800">
              {dark() ? '切換淺色模式' : '切換深色模式'}
            </button>
          </div>
          <h1 class="mt-3 text-3xl font-bold sm:text-4xl">尋找適合你的護理工作環境</h1>
          <p class="mt-4 max-w-2xl leading-7 text-teal-50">依照你重視的工作與生活條件探索醫院，為實習或求職做好準備。</p>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div class="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100" role="note">
          <strong>115 學年度（N49）畢業生就業推薦訊息。</strong> 實際推薦名額、篩選標準與待遇請以各院最新來文及學校公告為準。
        </div>

        <div class="mt-8 grid gap-8 md:grid-cols-[260px_1fr]">
          <aside class="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900" aria-label="篩選條件">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold">篩選條件</h2>
              <button type="button" class="text-sm font-semibold text-teal-700 underline hover:text-teal-900 dark:text-teal-300 dark:hover:text-teal-100" onClick={reset}>清除全部</button>
            </div>
            <div class="mt-5">
              <label for="search" class="block text-sm font-semibold">搜尋院所或縣市</label>
              <input id="search" type="search" placeholder="例如：台北" value={query()} onInput={(event) => setQuery(event.currentTarget.value)}
                class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-2 focus:outline-teal-600 dark:border-slate-600 dark:bg-slate-800" />
            </div>
            <For each={data.conditions}>{(condition) => (
              <div class="mt-5">
                <label for={`filter-${condition.id}`} class="block text-sm font-semibold">{condition.label}</label>
                <Show when={condition.type === 'text'} fallback={
                  <select id={`filter-${condition.id}`} value={filters()[condition.id] || ''}
                    onChange={(event) => setFilters({ ...filters(), [condition.id]: event.currentTarget.value })}
                    class="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-2 focus:outline-teal-600 dark:border-slate-600 dark:bg-slate-800">
                    <option value="">不限</option>
                    <For each={condition.options || []}>{(option) => <option value={option.value}>{option.label}</option>}</For>
                  </select>
                }>
                  <input id={`filter-${condition.id}`} type="text" placeholder={condition.placeholder || ''} value={filters()[condition.id] || ''}
                    onInput={(event) => setFilters({ ...filters(), [condition.id]: event.currentTarget.value })}
                    class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-2 focus:outline-teal-600 dark:border-slate-600 dark:bg-slate-800" />
                </Show>
              </div>
            )}</For>
          </aside>

          <section aria-labelledby="results-heading">
            <div class="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="results-heading" class="text-xl font-bold">院所列表</h2>
              <p class="text-sm text-slate-600 dark:text-slate-300" aria-live="polite">找到 {results().length} 間院所</p>
            </div>
            <Show when={results().length > 0} fallback={<p class="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">沒有符合條件的院所，請嘗試調整篩選條件。</p>}>
              <div class="grid gap-4 sm:grid-cols-2">
                <For each={results()}>{(hospital) => (
                  <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <p class="text-sm font-semibold text-teal-700 dark:text-teal-300">{hospital.city}</p>
                    <h3 class="mt-1 text-lg font-bold">{hospital.name}</h3>
                    <dl class="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-700">
                      <For each={data.conditions}>{(condition) => (
                        <div class="flex justify-between gap-3">
                          <dt class="text-slate-600 dark:text-slate-300">{condition.label}</dt>
                          <dd class="text-right font-medium">
                            {(() => {
                              const attr = hospital.attributes[condition.id]
                              if (condition.type === 'text') return attr || '未提供'
                              const values = Array.isArray(attr) ? attr : (attr ? [attr] : [])
                              const labels = values
                                .map((value) => condition.options?.find((option) => option.value === value)?.label)
                                .filter(Boolean)
                              return labels.length > 0 ? labels.join('、') : '未提供'
                            })()}
                          </dd>
                        </div>
                      )}</For>
                    </dl>
                  </article>
                )}</For>
              </div>
            </Show>
            <p class="mt-6 text-sm leading-6 text-slate-500 dark:text-slate-400">條件僅供比較，不構成求職建議。實際待遇與排班可能因科別、職位及時間而異。</p>
          </section>
        </div>
      </main>
    </div>
  )
}
