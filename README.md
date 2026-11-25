# 机场优惠（Airport Deals）· https://jichangyouhui.blog

基于 Astro + TypeScript + Tailwind CSS 构建的机场优惠资讯、优惠码中心、套餐价格对比与购买指南商业博客。

## 目录结构

- `src/data/site-config.ts`：全站基础配置、年份（`2026`）、首页 SEO 与导航配置。
- `src/data/brand-order/index.ts`：19 家品牌的编辑精选展示顺序（非测速排名）。
- `src/data/brands/*.ts`：19 家品牌档案、AFF 链接、优惠码、客户端政策与 FAQ 唯一数据源。
- `src/data/plans/index.ts`：全站套餐价格计算汇总层（调用 `src/utils/pricing.ts`）。
- `src/content/articles/` & `src/content/guides/`：深度专题文章与购买攻略（Markdown）。
- `src/pages/`：多页面路由（首页、`/coupons/`、`/brands/`、`/plans/`、`/comparison/`、`/cheap-airports/`、`/best-value/`、`/annual-deals/`、`/search/` 及 Sitemap XML 端点）。
- `scripts/verify-site.mjs`：上线前工程验收脚本（校验死链、占位符、H1、Title、AFF、JSON-LD 与中文搜索索引）。
- `scripts/indexnow.mjs`：基于变更哈希比对的 Bing IndexNow 提交脚本。

## 常用命令

```bash
# 本地开发预览
npm run dev

# 生产构建（输出到 dist/）
npm run build

# 运行全站工程验收检查
npm run verify

# 预览构建产物
npm run preview

# 检查并提交变更 URL 到 IndexNow（需配置 INDEXNOW_KEY）
npm run indexnow
```

## 相关文档

- [Bing SEO 与 Webmaster Tools 配置指南](./docs/BING-SEO-GUIDE.md)
- [Markdown 内容与品牌资料维护说明](./docs/CONTENT-MAINTENANCE.md)
- [静态部署与 IndexNow 配置说明](./docs/DEPLOYMENT.md)
- [已发布页面 URL 清单](./docs/PUBLISHED-URLS.md)
