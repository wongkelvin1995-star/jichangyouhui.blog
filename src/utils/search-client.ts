import { expandQueryTokens } from './search-synonyms';

export interface SearchDocument {
  id: string;
  type: 'brand' | 'coupon' | 'plan' | 'article' | 'guide';
  typeLabel: string;
  title: string;
  url: string;
  summary: string;
  category: string;
  brandName?: string;
  aliases?: string[];
  couponCodes?: string[];
  priceRange?: string;
  scenarios?: string[];
  keywords: string[];
  body: string;
}

export interface SearchMatch {
  doc: SearchDocument;
  score: number;
}

let cachedDocs: SearchDocument[] | null = null;
let loadingPromise: Promise<SearchDocument[]> | null = null;

export async function loadSearchIndex(): Promise<SearchDocument[]> {
  if (cachedDocs) return cachedDocs;
  if (!loadingPromise) {
    loadingPromise = fetch('/search-index.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load search index');
        return res.json() as Promise<SearchDocument[]>;
      })
      .then((docs) => {
        cachedDocs = docs;
        return docs;
      });
  }
  return loadingPromise;
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 99;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}

export function runSearch(docs: SearchDocument[], rawQuery: string): SearchMatch[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return [];

  const primaryTerms = q.split(/[\s,，、/+|]+/).filter(Boolean);
  const expandedTokens = expandQueryTokens(q);
  const results: SearchMatch[] = [];

  for (const doc of docs) {
    let score = 0;
    const titleL = doc.title.toLowerCase();
    const summaryL = doc.summary.toLowerCase();
    const bodyL = doc.body.toLowerCase();
    const brandL = (doc.brandName ?? '').toLowerCase();
    const aliasesL = (doc.aliases ?? []).map((x) => x.toLowerCase());
    const codesL = (doc.couponCodes ?? []).map((x) => x.toLowerCase());
    const kwL = doc.keywords.join(' ').toLowerCase();
    const catL = doc.category.toLowerCase();

    // 1. Exact brand match (highest priority)
    if (brandL && (brandL === q || aliasesL.some((a) => a === q))) {
      score += doc.type === 'brand' ? 500 : 220;
    } else if (brandL && (brandL.includes(q) || aliasesL.some((a) => a.includes(q)))) {
      score += doc.type === 'brand' ? 320 : 140;
    }

    // 2. Exact coupon code match
    if (codesL.some((c) => c === q)) {
      score += doc.type === 'coupon' ? 420 : 200;
    } else if (codesL.some((c) => c.includes(q) || (q.length >= 3 && editDistance(c, q) <= 1))) {
      score += doc.type === 'coupon' ? 240 : 110;
    }

    // 3. Title exact / partial match
    if (titleL === q) score += 300;
    else if (titleL.includes(q)) score += 180;

    // 4. Primary multi-keyword check
    let matchedPrimaryCount = 0;
    for (const term of primaryTerms) {
      let termHit = false;
      if (titleL.includes(term)) {
        score += 95;
        termHit = true;
      }
      if (aliasesL.some((a) => a.includes(term)) || codesL.some((c) => c.includes(term))) {
        score += 85;
        termHit = true;
      }
      if (catL.includes(term) || kwL.includes(term)) {
        score += 65;
        termHit = true;
      }
      if (summaryL.includes(term)) {
        score += 48;
        termHit = true;
      }
      if (bodyL.includes(term)) {
        score += 24;
        termHit = true;
      }
      // Typo tolerance for ascii terms >= 4 chars
      if (!termHit && /^[a-z0-9_-]{4,}$/.test(term)) {
        const candidates = [...aliasesL, ...codesL, ...doc.keywords.map((k) => k.toLowerCase())];
        if (candidates.some((cand) => editDistance(cand, term) <= 1)) {
          score += 55;
          termHit = true;
        }
      }
      if (termHit) matchedPrimaryCount++;
    }

    // Bonus when all primary terms match
    if (primaryTerms.length > 1 && matchedPrimaryCount === primaryTerms.length) {
      score += 90;
    }

    // 5. Expanded synonyms & Chinese bigrams
    for (const tok of expandedTokens) {
      if (primaryTerms.includes(tok)) continue;
      if (titleL.includes(tok)) score += 28;
      else if (kwL.includes(tok) || catL.includes(tok)) score += 20;
      else if (summaryL.includes(tok)) score += 14;
      else if (bodyL.includes(tok)) score += 6;
    }

    if (score > 0) {
      results.push({ doc, score });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

export function highlightText(text: string, rawQuery: string): string {
  const safe = escapeHtml(text);
  const terms = rawQuery
    .trim()
    .split(/[\s,，、/+|]+/)
    .filter((t) => t.length >= 1)
    .slice(0, 6);
  if (!terms.length) return safe;

  const escapedTerms = terms.map((t) =>
    escapeHtml(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  const re = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
  return safe.replace(re, '<mark class="search-hl">$1</mark>');
}

export function initSearchModal() {
  const modal = document.getElementById('global-search-modal');
  const input = document.getElementById('modal-search-input') as HTMLInputElement | null;
  const resultsBox = document.getElementById('modal-search-results');
  const closeBtn = document.getElementById('close-search-modal');

  if (!modal || !input || !resultsBox) return;

  const defaultMarkup = resultsBox.innerHTML;

  function openModal() {
    modal!.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => input!.focus(), 30);
    loadSearchIndex().catch(() => {});
  }

  function closeModal() {
    modal!.classList.add('hidden');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement | null;
    if (t?.closest('[data-open-search]')) {
      e.preventDefault();
      openModal();
      return;
    }
    const quickBtn = t?.closest<HTMLButtonElement>('[data-quick-query]');
    if (quickBtn) {
      const kw = quickBtn.getAttribute('data-quick-query') ?? '';
      input.value = kw;
      input.dispatchEvent(new Event('input'));
    }
  });

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  let debounceId: number | undefined;
  input.addEventListener('input', () => {
    const val = input.value.trim();
    if (!val) {
      resultsBox.innerHTML = defaultMarkup;
      return;
    }
    if (debounceId) window.clearTimeout(debounceId);
    debounceId = window.setTimeout(async () => {
      try {
        const docs = await loadSearchIndex();
        const matches = runSearch(docs, val).slice(0, 8);
        if (!matches.length) {
          resultsBox.innerHTML = `
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
              <p class="font-medium text-slate-800 mb-1">未找到与「${escapeHtml(val)}」直接匹配的内容</p>
              <p class="text-xs mb-3">你可以按回车进入完整搜索页查看分类推荐，或直接浏览热门栏目：</p>
              <div class="flex flex-wrap gap-2">
                <a href="/coupons/" class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium">优惠码中心</a>
                <a href="/brands/" class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium">全部 19 家品牌</a>
                <a href="/comparison/" class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium">套餐价格对比</a>
              </div>
            </div>`;
          return;
        }
        const itemsHtml = matches
          .map(
            ({ doc }) => `
            <a href="${escapeHtml(doc.url)}" class="block p-3 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors">
              <div class="flex items-center justify-between gap-2 mb-1">
                <span class="font-semibold text-[#102343]">${highlightText(doc.title, val)}</span>
                <span class="shrink-0 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]">${escapeHtml(doc.typeLabel)}</span>
              </div>
              <p class="text-xs text-slate-600 line-clamp-2">${highlightText(doc.summary, val)}</p>
            </a>`
          )
          .join('');
        resultsBox.innerHTML = `
          <div class="space-y-2">${itemsHtml}</div>
          <div class="pt-2 text-center">
            <a href="/search/?q=${encodeURIComponent(val)}" class="inline-flex items-center px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#102343]">
              查看「${escapeHtml(val)}」全部搜索结果 →
            </a>
          </div>`;
      } catch {
        resultsBox.innerHTML = '<p class="text-xs text-slate-500">搜索索引加载中，请按回车前往搜索结果页。</p>';
      }
    }, 100);
  });
}
