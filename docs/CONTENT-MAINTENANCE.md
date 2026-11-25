# Markdown 内容与品牌数据维护说明

本站采用「统一品牌套餐数据库 + Markdown 内容集合」的双轨架构，确保所有价格、优惠码与文章信息同源且可长期维护。

## 一、新增或更新机场品牌资料

1. **编辑排序配置**：打开 `src/data/brand-order/index.ts`，在 `BRAND_ORDER` 数组中添加新品牌的 `slug`、`name`、`featuredRank` 与 `selectionReason`。
2. **录入品牌与套餐数据**：在 `src/data/brands/`（例如新增 `group5.ts` 并在 `src/data/brands/index.ts` 引入）按 `BrandData` 接口填写真实可追溯信息：
   - **AFF 链接**：完整保留参数放入 `affLink` 与 `affCode`。
   - **优惠码**：仅在具有官方说明或明确核验依据时设置 `calculable: true` 与 `discountMultiplier`；未公布具体折扣比例的设置 `calculable: false, discountMultiplier: null`，并在 `evidenceNote` 中说明以结账页为准。
   - **套餐表**：使用 `buildMatrixPlans` / `makePlans` 统一录入。
   - **严禁占位符**：若某字段无依据，直接省略或写明客观边界，禁止写入 `待核实`、`待验证`、`暂无资料`、`DEMO` 等占位文字。
3. **自动联动更新**：保存后执行 `npm run build`，系统会自动生成或更新：
   - `/brands/<slug>/`、`/coupons/<slug>/`、`/plans/<slug>/`
   - `/comparison/`、`/coupons/`、`/cheap-airports/`、`/best-value/`、`/annual-deals/`
   - `/search-index.json`（全站中文搜索索引）与 `/sitemap*.xml`

## 二、新增或修改 Markdown 文章

文章存放于 `src/content/articles/` 或 `src/content/guides/`，Frontmatter 标准字段如下：

```yaml
---
title: "文章主标题（独立且不与品牌页竞争主词）"
description: "100-150 字摘要，同时用于 Meta Description"
slug: "url-slug"
category: "分类名称"
brand: "可选，关联品牌 slug，如 lingdongyun"
publishDate: "2026-11-25"
updatedDate: "2026-11-25"
author: "机场优惠编辑部"
tags: ["标签1", "标签2"]
relatedBrands: ["lingdongyun", "dalaoyun"]
relatedArticles: ["other-article-slug"]
sources: ["资料来源说明"]
draft: false
---
```

- 将未完成文稿的 `draft` 设为 `true`，构建时会自动排除在正式页面、搜索索引与 Sitemap 之外。
- 文章正文应保持仅含 `##` / `###` 标题（页面 `<h1>` 由 `ArticleLayout.astro` 自动渲染），避免重复 H1。
- 仅在文章真实修改后手动更新 `updatedDate`。

## 三、年份配置规范

全站统一使用 `src/data/site-config.ts` 中的 `currentYear: 2026` 管理展示年份，不通过脚本自动篡改历史文章的发布日期与修改时间。
