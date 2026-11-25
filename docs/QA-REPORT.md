# 上线前工程验收报告（内部开发文档）

> 验收日期：2026-11-25（UTC+8）  
> 本文件仅作为开发与工程质量检验记录保留，不作为公开博客文章发布。

## 1. 静态构建与链接/SEO/合规自动化审计（`npm run build && npm run verify`）

- **构建结果**：Astro v5.18.2 静态输出 **129 个页面**（含 127 个可索引页面及 `/search/`、`/404.html`）。
- **数据完整性与内容红线**：
  - 全部 129 个 HTML 文件及 `dist/search-index.json`（224 条索引记录）经扫描确认 **0 处** `待核实`、`待验证`、`待填写`、`暂无资料`、`数据缺失`、`测试数据`、`测试中`、`DEMO`、`Lorem Ipsum`。
  - 全部 19 家品牌专属页面的推广按钮均与各自资料档案指定的 AFF 参数完全一致（0 错配）。
  - 所有页面均仅有唯一 `<h1>`，127 个可索引页面 `<title>` 与 Canonical URL 均独立唯一且无重复。
  - `/search/` 与 `/404/` 均带有 `noindex, follow` 且未写入任何 Sitemap XML。
  - 全部站内 `<a href="/...">` 内部链接均指向真实存在文件，0 处 `href="#"`。
  - 所有页面 JSON-LD（`WebSite`、`Organization`、`WebPage`、`BlogPosting`、`CollectionPage`、`ItemList`、`BreadcrumbList`、`FAQPage`）均通过 JSON 解析校验。

## 2. 中文检索与同义词测试（`tsx` 运行生产检索逻辑）

针对 `dist/search-index.json`（224 条记录）验证以下 17 组关键词全部返回有效匹配：
- `灵动云`（53 条）、`大佬云`（41 条）、`优惠码`（98 条）、`机场优惠`（110 条）、`机场推荐`（59 条）、`便宜机场`（61 条）、`年付`（165 条）、`100GB`（115 条）、`不限时流量`（114 条）、`AI`（36 条）、`ChatGPT`（36 条）、`Netflix`（31 条）、`Clash`（62 条）、`科学上网`（64 条）、`魔法上网`（64 条）、`ld888`（56 条）、拼写容错 `lingdongyn`（42 条）。

## 3. Edge Headless 浏览器多端渲染与交互验收

通过本地静态服务 + Edge Headless CDP 在 9 个标准分辨率（`320px`、`375px`、`390px`、`414px`、`430px`、`768px`、`1024px`、`1440px`、`1920px`）测试 `/`, `/coupons/`, `/brands/lingdongyun/`, `/comparison/`, `/articles/lingdongyun-buying-guide/`, `/search/?q=灵动云`：
- **横向溢出检查**：全部 6 个路由 × 9 种分辨率均满足 `scrollWidth <= innerWidth`（0 处溢出）。
- **移动端菜单**：`#mobile-menu-toggle` 展开/收起正常。
- **优惠码复制**：点击 `data-copy-code` 触发剪贴板写入及底部 Toast 与按钮文案反馈正常。
- **套餐筛选器**：`/comparison/` 按品牌筛选 `lingdongyun` 准确更新为 29 档。
- **中文搜索页**：`/search/?q=魔法上网` 正常渲染高亮结果列表。
- **控制台与运行时报错**：0 errors。
